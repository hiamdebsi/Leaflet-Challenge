// LEVEL 1: BASIC VIZUALISATION //
//Get the Data Set

//Using "All Earthquakes from the past 7 days"
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Function for Color of Markers//
function markerColor(depth){
    switch (true) {
    case depth > 90:
        return "#d73027";
    case depth >= 70:
        return "#fc8d59";
    case depth >=50:
        return "#fee08b";
    case depth>=30:
        return "#d9ef8b";
    case depth>=10:
        return "#91cf60";
    case depth >=-10:
        return "#1a9850";
    }
}

//Function for Radius of Markers//
function markerRadius(magnitude){
    if (magnitude === 0){
        return 1;
    }
    return magnitude * 5;
};

//Create function for the map
function createMap(earthquake){
    //Set the map to show in the USA
    let map = L.map('map', {
        center: [39.0902,-95.7129],
        zoom: 5
    });

    //Set the grayscale map using MapBox (AccessToken on the config.js file)
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        accessToken: API_KEY
    }).addTo(map);

    //Add the geoJson Layer//
    L.geoJson(earthquake, {
        pointToLayer: function(feature, coord) {
            return L.circleMarker(coord, {
                opacity: 1,
                fillOpacity: 1,
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#000000",
                radius: markerRadius(feature.properties.mag),
                stroke: true,
                weight: 0.5
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup (`<strong>Location: </strong> ${feature.properties.place}<br><strong>Magnitude: </strong> ${feature.properties.mag}<br><strong>Depth: </strong>${feature.geometry.coordinates[2]}`)
        }
    }).addTo(map);

    //Create a legend to display the depth color range for earthquakes
    var legend = L.control({
        position: "bottomright"
    });

    //When the layer control is added, insert a div with the class of "legend".
    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "info legend"),
        range = ["-10-10","10-30","30-50","50-70","70-90","90+"],
        colors = ["#1a9850","#91cf60","#d9ef8b","#fee08b","#fc8d59","#d73027"];

        for (var i=0; i<range.length;i++){
            div.innerHTML += '<i style = "background: ' + colors[i] + '"></i>' + range[i] + '<br>';
        }
        return div;
    }

    //Add the info legend to the map
    legend.addTo(map);
}

//Perform API call
d3.json(url).then(createMap);

