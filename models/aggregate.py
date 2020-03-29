"""Aggregate data from S3 into ML ready format. WIP.
"""
import pandas as pd
import pygeohash
from pyarrow.parquet import ParquetFile
from pyproj import Geod


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

    df_case_grid = pd.DataFrame()

    for j in range(pf.num_row_groups):
        print(f'  processing group {j + 1}/{pf.num_row_groups}...')
        # load one group at a time (its a big file)
        df_raw = pf.read_row_group(j).to_pandas()

        # calculate lat and lon
        unique_geohash = df_raw[['geo_hash']].drop_duplicates()
        lat_lon = pd.DataFrame(
            unique_geohash.geo_hash.apply(pygeohash.decode).to_list(),
            columns=['lat', 'lon'])
        lat_lon['geo_hash'] = unique_geohash.values

        # get reference points ONCE and use same ones every time
        if i == 0:
            lon_ref, lat_ref = lat_lon.lon.mean(), lat_lon.lat.mean()
            print(f'\nlon ref: {lon_ref}, lat ref: {lat_ref}\n')

        # get distances in km in both directions
        geod = Geod(ellps='WGS84')
        lat_lon["lon_dist_km"] = lat_lon.lon.map(
            lambda x: geod.inv(lon_ref, lat_ref, x, lat_ref)[2] / 1000)
        lat_lon["lat_dist_km"] = lat_lon.lat.map(
            lambda x: geod.inv(lon_ref, lat_ref, lon_ref, x)[2] / 1000)
        df_raw = pd.merge(df_raw, lat_lon, on='geo_hash')

        # round to km grid
        df_raw['lat_grid_km'] = df_raw.lat_dist_km.round().astype(int)
        df_raw['lon_grid_km'] = df_raw.lon_dist_km.round().astype(int)

        # case counts per point on grid
        df_case_grid_1group = df_raw.groupby(
            ['lat_grid_km', 'lon_grid_km']).count()[['caid']].rename(
                columns={'caid': datestring}).reset_index()
        del(df_raw)

        df_case_grid = pd.concat([df_case_grid, df_case_grid_1group])

    if i == 0:
        df = df_case_grid
    else:
        df = pd.merge(df, df_case_grid, how='outer',
                      on=['lat_grid_km', 'lon_grid_km'])

    print()
    print(df.sample(10))
    print(df_case_grid.isna().sum())

df = df.fillna(0).astype(int)
df.to_csv('../data/case_grid_timeseries.csv', index=False)
