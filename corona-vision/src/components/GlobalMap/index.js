import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet.markercluster';

import MarkerCluster from '../MarkerCluster';
import { getEvents } from '../../utils/api';


const GlobalMap = () => {

    const position = [34.0522, -118.2437];

    const [addressPoints, setAddressPoints] = React.useState([]);
    const [bounds, setBounds] = React.useState({});
    const [map, setMap] = React.useState(null);

    React.useEffect(() => {
        async function getData () {
            const response = await getEvents(bounds);
            setAddressPoints(response);
        }
        getData();
    }, [bounds]);

    const handleViewport = () => {
        const mapBounds = map.leafletElement.getBounds();
        const maxlat = mapBounds.getNorth();
        const minlat = mapBounds.getSouth();
        const maxlng = mapBounds.getEast();
        const minlng = mapBounds.getWest();
        setBounds({
            maxlat,
            minlat,
            maxlng,
            minlng
        });
    }

    return (
        <Map 
            ref={(ref) => setMap(ref)}
            center={position} 
            zoom={11}
            onViewportChanged={handleViewport}
            whenReady={handleViewport}
        >
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