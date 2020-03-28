import { useEffect } from 'react';
import L from 'leaflet';
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useLeaflet } from 'react-leaflet';

import '../../MarkerCluster.Default.css';

const mcg = L.markerClusterGroup();

const tooltipMsgCurrent = (cases, date) => {
    return `${date}: ${cases.toString()} current cases`
};

const MarkerCluster = props => {

    const { map } = useLeaflet();

    useEffect(() => {
        mcg.clearLayers();
        props.markers.forEach(({ position, currentCaseCount, date }) => (
            L.marker(new L.LatLng(position.lat, position.lng))
        )
        .addTo(mcg)
        .bindTooltip(tooltipMsgCurrent(currentCaseCount, date))
        )
    map.addLayer(mcg);
    }, [props.markers, map]);

    return null;
}

export default MarkerCluster;