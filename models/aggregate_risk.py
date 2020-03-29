"""Aggregate smartphone data from S3 into risk per location.

WIP: currently uses distance traveled by people at different
home locations as a proxy for risk. Home is defined by a user's
most frequent geo_hash. We calculate the max distance from home
travelled by each user, and then take an average these values
at each distinct lat/lon home location in the dataset.

TODO: normalize distances traveled into some measure of risk.
"""
import pandas as pd
import pygeohash
from pyarrow.parquet import ParquetFile
from pyproj import Geod


# smartphone geolocations for each day in New York
files = ['Mar10.parquet',
         'Mar11.parquet',
         'Mar12.parquet',
         'Mar13.parquet',
         'Mar14.parquet',
         'Mar15.parquet',
         'Mar16.parquet',
         'Mar17.parquet',
         ]

for i, filename in enumerate(files):
    print(f'\n{filename}')

    datestring = filename.split('.')[0]
    pf = ParquetFile('../data/' + filename)

    distinct_locs = pd.DataFrame()

    for j in range(pf.num_row_groups):
        print(f'  processing group {j + 1}/{pf.num_row_groups}...')
        # load one group at a time (its a big file)
        df_raw = pf.read_row_group(j).to_pandas()

        # most frequent user position (2m20s)
        user_mode_loc = df_raw.groupby('caid').agg(
            {'geo_hash': pd.Series.mode})
        user_mode_loc['geo_hash_mode'] = user_mode_loc.geo_hash.apply(
            lambda x: x if isinstance(x, str) else x[0])  # if 2 modes use 1st
        user_mode_loc = user_mode_loc.drop(columns='geo_hash').reset_index()

        # distinct locations for each user this day
        dist_locs = df_raw[['caid', 'geo_hash']].drop_duplicates()
        dist_locs = pd.merge(dist_locs, user_mode_loc,
                             on='caid', how='left')
        del(df_raw)
        del(user_mode_loc)

        # get lat, lon for all geo hashes
        unique_geohash = dist_locs[['geo_hash']].drop_duplicates()
        lat_lon = pd.DataFrame(
            unique_geohash.geo_hash.apply(pygeohash.decode).to_list(),
            columns=['lat', 'lon'])
        lat_lon['geo_hash'] = unique_geohash.values
        dist_locs = pd.merge(dist_locs, lat_lon, on='geo_hash')

        unique_geohash = dist_locs[['geo_hash_mode']].drop_duplicates()
        lat_lon = pd.DataFrame(
            unique_geohash.geo_hash_mode.apply(pygeohash.decode).to_list(),
            columns=['lat_mode', 'lon_mode'])
        lat_lon['geo_hash_mode'] = unique_geohash.values
        dist_locs = pd.merge(dist_locs, lat_lon, on='geo_hash_mode')

        # distance between user location and their most frequent location (5m)
        geod = Geod(ellps='WGS84')
        dist_locs['dist_km'] = dist_locs.apply(
            lambda row:
            geod.inv(row.lon, row.lat, row.lon_mode, row.lat_mode)[2] / 1000,
            axis=1)

        # combine distinct locations across the parquet groups
        distinct_locs = pd.concat([distinct_locs, dist_locs])
        # NOTE: may have duplicate entries per user-geo_hash_mode,
        # but its too computationally challenging for my laptop to
        # calculate mode (home) across the entire dataset. Effectively
        # if they have a different home in the two datasets they will
        # be treated as 2 measures of max distance traveled from home.

    # most frequent user position ("home"), now with lat, lon
    user_mode_loc = distinct_locs.loc[
        distinct_locs.geo_hash == distinct_locs.geo_hash_mode,
        ['caid', 'geo_hash', 'lat', 'lon']]

    # get max distance traveled from home per user
    user_home_summary = distinct_locs.groupby(
        ['caid', 'geo_hash'])[['dist_km']].max()
    user_home_summary = user_home_summary.reset_index().rename(
        columns={'dist_km': 'max_dist_km'})
    user_home_summary = pd.merge(user_mode_loc, user_home_summary,
                                 on=['caid', 'geo_hash'])

    # get average of max-user-travel per lat, lon location
    geo_summ = user_home_summary.groupby(['lat', 'lon']).agg(
        {'max_dist_km': ['mean', 'count']})
    geo_summ.columns = ['dist_km', 'num']
    geo_summ.reset_index(inplace=True)

    # combine days using count-weighted averages of distance per location
    if i == 0:
        geo_summary = geo_summ
    else:
        geo_summary = pd.merge(geo_summary, geo_summ, how='outer',
                               on=['lat', 'lon'], suffixes=['_1', '_2'])
        geo_summary.fillna(0, inplace=True)
        geo_summary['dist_km'] = (
            (geo_summary.dist_km_1 * geo_summary.num_1 +
             geo_summary.dist_km_2 * geo_summary.num_2) /
            (geo_summary.num_1 + geo_summary.num_2)
            )
        geo_summary['num'] = geo_summary.num_1 + geo_summary.num_2

        geo_summary = geo_summary[['lat', 'lon', 'dist_km', 'num']]

# pivot into lat x lon grid
geo_summary_grid = geo_summary.pivot_table(
    index='lat', columns='lon', values='dist_km')

# sort rows and columns
geo_summary_grid.columns = geo_summary_grid.columns.sort_values()
geo_summary_grid.sort_index(ascending=False, inplace=True)

geo_summary_grid.to_csv('geo_summary_grid.csv')
geo_summary.to_csv('geo_summary.csv', index=False)
