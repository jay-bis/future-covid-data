import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet.markercluster';

import MarkerCluster from '../MarkerCluster';


const GlobalMap = () => {
    
    const position = [34.0522, -118.2437];

    var addressPoints =
    [
        {"date": "2020-03-01", "symptomatic": true, "position": {"lat": 34.052235, "lng": -118.243685}},
        {"date": "2020-03-02", "symptomatic": false, "position": {"lat": 34.052245000000006, "lng": -118.253695}},
        {"date": "2020-03-03", "symptomatic": true, "position": {"lat": 34.07225500000001, "lng": -118.243705}},
        {"date": "2020-03-04", "symptomatic": false, "position": {"lat": 34.05226500000001, "lng": -118.24671500000001}},
        {"date": "2020-03-05", "symptomatic": true, "position": {"lat": 34.052275000000016, "lng": -118.26372500000001}},
        {"date": "2020-03-06", "symptomatic": false, "position": {"lat": 34.01228500000002, "lng": -118.24973500000002}},
        {"date": "2020-03-07", "symptomatic": true, "position": {"lat": 34.03229500000002, "lng": -118.25374500000002}},
        {"date": "2020-03-08", "symptomatic": true, "position": {"lat": 34.052305000000025, "lng": -118.28375500000002}},
        {"date": "2020-03-09", "symptomatic": true, "position": {"lat": 34.03231500000003, "lng": -118.2176500000002}}, 
        {"date": "2020-03-10", "symptomatic": true, "position": {"lat": 34.02232500000003, "lng": -118.21377500000003}}, 
        {"date": "2020-03-11", "symptomatic": true, "position": {"lat": 34.062335000000035, "lng": -118.23378500000003}}, 
        {"date": "2020-03-12", "symptomatic": true, "position": {"lat": 34.05234500000004, "lng": -118.24379500000003}}, 
        {"date": "2020-03-13", "symptomatic": false, "position": {"lat": 34.05235500000004, "lng": -118.26380500000004}}, 
        {"date": "2020-03-14", "symptomatic": false, "position": {"lat": 34.092365000000044, "lng": -118.29381500000004}}, 
        {"date": "2020-03-15", "symptomatic": false, "position": {"lat": 34.08237500000005, "lng": -118.25382500000004}}
    ]

    return (
        <Map center={position} zoom={13}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <MarkerCluster
                markers={addressPoints}
            />
        </Map>
    )
};

export default GlobalMap;