import React, { useEffect } from 'react';
import L from 'leaflet';
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useLeaflet } from 'react-leaflet';

const mcg = L.markerClusterGroup();

const MarkerCluster = props => {

    const { map } = useLeaflet();

    useEffect(() => {
        mcg.clearLayers();
        props.markers.forEach(( { position, currentCaseCount }) => (
            L.marker(new L.LatLng(position.lat, position.lng))
        )
        .addTo(mcg)
        .bindPopup(currentCaseCount.toString())
        )
    map.addLayer(mcg);
    }, [props.markers, map]);

    return null;
}

export default MarkerCluster;