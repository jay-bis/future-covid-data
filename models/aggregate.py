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

# add lat and lon columns to dataframe
unique_geohash = df[['geo_hash']].drop_duplicates()
lat_lon = pd.DataFrame(
    unique_geohash.geo_hash.apply(pygeohash.decode).to_list(),
    columns=['lat', 'lon'])
lat_lon['geo_hash'] = unique_geohash.values
df = pd.merge(df, lat_lon, on='geo_hash')

# descretize onto a grid
lon_ref, lat_ref = df.lon.mean(), df.lat.mean()  # reference points
geod = Geod(ellps='WGS84')
df["lon_dist_km"] = df.lon.map(
    lambda x: geod.inv(lon_ref, lat_ref, x, lat_ref)[2] / 1000)
df["lat_dist_km"] = df.lat.map(
    lambda x: geod.inv(lon_ref, lat_ref, lon_ref, x)[2] / 1000)
