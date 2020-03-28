"""Aggregate data from S3 into ML ready format. WIP.
"""
import pandas as pd
from pyarrow.parquet import ParquetFile
from pyproj import Geod
import pygeohash


file = '../data/Mar10.parquet'
pf = ParquetFile(file)

# this is just the first group (its a big file)
# for experimenting purposes
df = pf.read_row_group(0).to_pandas()

# calculate lat and lon
unique_geohash = df[['geo_hash']].drop_duplicates()
lat_lon = pd.DataFrame(
    unique_geohash.geo_hash.apply(pygeohash.decode).to_list(),
    columns=['lat', 'lon'])
lat_lon['geo_hash'] = unique_geohash.values

# get distances in km in both directions
lon_ref, lat_ref = lat_lon.lon.mean(), lat_lon.lat.mean()  # reference points
geod = Geod(ellps='WGS84')
lat_lon["lon_dist_km"] = lat_lon.lon.map(
    lambda x: geod.inv(lon_ref, lat_ref, x, lat_ref)[2] / 1000)
lat_lon["lat_dist_km"] = lat_lon.lat.map(
    lambda x: geod.inv(lon_ref, lat_ref, lon_ref, x)[2] / 1000)
df = pd.merge(df, lat_lon, on='geo_hash')
