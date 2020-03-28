import React, { useEffect } from 'react';
import L from 'leaflet';
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useLeaflet } from 'react-leaflet';

import '../../MarkerCluster.Default.css';

const mcg = L.markerClusterGroup();

const tooltipMsg = date => {
    return `Case on: ${date}`
};

const MarkerCluster = props => {

    const { map } = useLeaflet();

    useEffect(() => {
        mcg.clearLayers();
        props.markers.forEach(({ position, symptomatic, date }) => (
            L.marker(new L.LatLng(position.lat, position.lng), {
                icon: new L.Icon({iconUrl: symptomatic 
                    ? 
                    'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
                    :
                    'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
                })
            })
        )
        .addTo(mcg)
        .bindTooltip(tooltipMsg(date))
        )
    map.addLayer(mcg);

    var legend = L.control({position: 'topleft'});
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info-legend');
        const labels = ['<strong>Legend</strong>'];
        const categories = ['Symptomatic','Asymptomatic'];

        for (var i = 0; i < categories.length; i++) {

                div.innerHTML += 
                labels.push(
                    categories[i] === 'Symptomatic' 
                    ? "<p>Symptomatic User: </p><img src='https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png' />"
                    : "<p>Asymptomatic User: </p><img src='https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png' />"
                );

            }
            div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map);

    }, [props.markers, map]);

    return null;
}

export default MarkerCluster;