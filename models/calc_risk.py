"""Calculate a measure of risk and upload to AWS.

Get COVID-19 cases for just NY. Combine with smartphone geolocation
data from March 10 (future work should aggregate more than one day)
which measures how much people move around. Together we invent a
risk metric that combines these two measures into a 0-1 score.

Downloaded the data here (git hash on this repo was 726aafb):
https://github.com/beoutbreakprepared/nCoV2019/blob/master/latest_data/latestdata.csv

Renamed file latest_data.csv -> latest_data_beoutbreakprepared_nCov2019.csv
Filtered to NY only, and output lat, lon, date confirmed.
"""
import json
import os
import decimal

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import boto3
from pyproj import Geod
import pygeohash


df = pd.read_csv('../data/latest_data_beoutbreakprepared_nCov2019.csv',
                 low_memory=False)

cols = ['latitude', 'longitude', 'date_confirmation']  # 'city', 'province',
df_ny_cases = df.loc[(df.country == 'United States') &
                     (df.province == 'New York')][cols].copy()

df_ny_cases.dropna(inplace=True)
df_ny_cases['date'] = pd.to_datetime(df_ny_cases.date_confirmation)
df_ny_cases.drop(columns='date_confirmation', inplace=True)
# df_ny_cases.to_csv('../data/ny_covid_cases.csv', index=False)

ny_case_count = df_ny_cases.groupby(['latitude', 'longitude']).count()
ny_case_count = ny_case_count.rename(columns={'date': 'cases'}).reset_index()

# we use just one day of cell phone location data here.
# in the future we should aggregate more, but we ran into
# some issues and bugs trying to get it all together here.
df_travel = pd.read_csv('geo_summary_Mar10.csv')

geod = Geod(ellps='WGS84')

num_cases_within_dist = []

for tup in df_travel.itertuples():
    distance_km = ny_case_count.apply(
        lambda row:
        geod.inv(tup.lon, tup.lat, row.longitude, row.latitude)[2] / 1000,
        axis=1)
    n = ((distance_km < tup.dist_km).astype(int) * ny_case_count.cases).sum()
    num_cases_within_dist.append(n)

df_travel['num_cases_nearby'] = num_cases_within_dist

# define risk as the product of the log-scaled risk factors
# (nearby cases and average distance traveled at a location)
# and scale to 0 - 1 range
df_travel['log1pN'] = np.log10(df_travel.num_cases_nearby + 1)
df_travel['log1pD'] = np.log10(df_travel.dist_km + 1)
df_travel['risk'] = df_travel['log1pD'] * df_travel['log1pN']
df_travel['risk'] = df_travel['risk'] / df_travel['risk'].max()

geo_summary_grid = df_travel.pivot_table(
    index='lat', columns='lon', values='risk')

geo_summary_grid.columns = geo_summary_grid.columns.sort_values()
geo_summary_grid.sort_index(ascending=False, inplace=True)

# make a risk heatmap
plt.figure(figsize=(10, 6))
sns.heatmap(geo_summary_grid, cmap=sns.cm.rocket_r)
plt.title('Relative Risk (based on nearby cases & travel distances)', size=20)
plt.savefig('relative_risk_heatmap.png')

# curate final dataframe for DB upload
df_risk = df_travel[['lat', 'lon', 'risk']].copy()
df_risk['geo_4'] = df_risk.apply(
    lambda row: pygeohash.encode(row.lat, row.lon, precision=4), axis=1)
df_risk['geo_8'] = df_risk.apply(
    lambda row: pygeohash.encode(row.lat, row.lon, precision=8), axis=1)
df_risk.rename(columns={'lon': 'lng'}, inplace=True)
df_risk['date'] = '2020-03-29'

# drop 0 risk areas
df_risk_no0 = df_risk.loc[df_risk.risk > 0].reset_index(drop=True)
json_dict = df_risk_no0.T.to_dict()

# cred AWS credentials and upload
aws_key = os.environ["AWS_KEY"]
aws_secret = os.environ["AWS_SECRET"]

dynamodb = boto3.resource('dynamodb',
                          region_name='us-east-1',
                          aws_access_key_id=aws_key,
                          aws_secret_access_key=aws_secret)
table = dynamodb.Table("predictions")

for item in json_dict.values():
    table.put_item(
        Item=json.loads(json.dumps(item), parse_float=decimal.Decimal))
