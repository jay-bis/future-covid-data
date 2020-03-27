import { useEffect } from 'react';
import L from 'leaflet';
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useLeaflet } from 'react-leaflet';

import '../../MarkerCluster.Default.css';

const mcg = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        const childCount = cluster.getChildCount();

        var c = ' marker-cluster-';
        if (childCount < 10) {
            c += 'small';
        } else if (childCount < 100) {
            c += 'medium';
        } else {
            c += 'large';
        }

        return new L.DivIcon({ className: 'marker-cluster' + c, iconSize: new L.Point(50, 50)});
    }
});

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