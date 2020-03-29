"""Get cases for just NY for use in risk map.

Downloaded the data here (git hash on this repo was 726aafb):
https://github.com/beoutbreakprepared/nCoV2019/blob/master/latest_data/latestdata.csv

Renamed file latest_data.csv -> latest_data_beoutbreakprepared_nCov2019.csv
Filtered to NY only, and output lat, lon, date confirmed.
"""
import pandas as pd

df = pd.read_csv('../data/latest_data_beoutbreakprepared_nCov2019.csv',
                 low_memory=False)

cols = ['latitude', 'longitude', 'date_confirmation']  # 'city', 'province',
df_ny_cases = df.loc[(df.country == 'United States') &
                     (df.province == 'New York')][cols].copy()

df_ny_cases.dropna(inplace=True)
df_ny_cases.to_csv('../data/ny_covid_cases.csv', index=False)
