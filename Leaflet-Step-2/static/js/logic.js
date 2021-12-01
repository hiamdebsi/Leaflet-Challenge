//LEVEL 2: More Data (Optional)//

//Get the Data Sets
//Earthquake JSON
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//Boundaries JSON
var platesURL = "static/data/PB2002_boundaries.json";

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
};

//Function for Radius of Markers//
function markerRadius(magnitude){
    if (magnitude === 0){
        return 1;
    }
    return magnitude * 5;
};

function createMap(earthquake, plates){
    //Create Layer Groups
    var earthquakeData = new L.layerGroup();
    var platesData = new L.layerGroup();

    //Define earthquake and plates markers.
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
    }).addTo(earthquakeData);

    L.geoJson(plates, {
        style: function(){
            return{
                color: "orange",
                weight: 1.5,
                fillColor: "#00000",
                fillOpacity: 0
            }
        }
    }).addTo(platesData);

    //Set the grayscale, satellite, and outdoors map using MapBox (AccessToken on the config.js file)
    var GrayMap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        accessToken: API_KEY
    });

    var Outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        accessToken: API_KEY
    });

    var Satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        accessToken: API_KEY
    });

    //Create the baseMaps Array to chose the type of map wanted displayed
    var baseMaps = {
        "Grayscale": GrayMap,
        "Outdoors": Outdoors,
        "Satellite": Satellite
    };

    //Declare the overlays
    var overlayMaps = {
        "Earthquakes": earthquakeData,
        "Plate Boundaries": platesData
    };

    //Set the map to show in the USA
    let map = L.map('map', {
        center: [39.0902,-95.7129],
        zoom: 5,
        //Default Layers to be displayed
        layers: [Satellite, earthquakeData, platesData]
    });
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
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
    };

    //Add the info legend to the map as well as the layers 
    legend.addTo(map);
};

//Perform API call
d3.json(earthquakeURL).then(function(response_ea){
    d3.json(platesURL).then(function(response_pl){
        createMap(response_ea, response_pl)
    })
});
//d3.json(platesURL).then(createMap); 
