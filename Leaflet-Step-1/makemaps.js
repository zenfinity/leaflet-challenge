// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // Function to determine marker size based on quake magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

//Use Google palette to get range of rgb colors
var colorRange = palette('cb-YlOrRd',9);
//console.log(colorRange);

//Return a color based on quake magnitude
function determineColor(rating) {
    if ( rating < 1) {
        //console.log(colorRange[0]);
        return colorRange[0];
    } else if ( rating < 2 ) {
        //console.log(colorRange[1]);
        return colorRange[1];
    } else if ( rating < 3 ) {
        //console.log(colorRange[2]);
        return colorRange[2];
    } else if ( rating < 4 ) {
        //console.log(colorRange[3]);
        return colorRange[3];
    } else if ( rating < 5 ) {
        //console.log(colorRange[4]);
        return colorRange[4];
    } else if ( rating < 6 ) {
        //console.log(colorRange[5]);
        return colorRange[5];
    } else if ( rating < 7 ) {
        //console.log(colorRange[6]);
        return colorRange[6];
    } else if ( rating < 8 ) {
        //console.log(colorRange[7]);
        return colorRange[7];
    } else {
        //console.log(colorRange[8]);
        return colorRange[8];
    }
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    createFeatures(data.features); 
});

//Function to create features onto new layer
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                stroke: false,
                fillOpacity: 0.5,
                color: "#" + determineColor(feature.properties.mag),
                fillColor: "#" + determineColor(feature.properties.mag),
                radius: markerSize(feature.properties.mag)
            })
            .bindPopup("<h3> Magnitude " + feature.properties.mag + "</h3><hr>" +
            feature.properties.place + "<p>" + new Date(feature.properties.time) + "</p>"); 
        }
    });
    //console.log(earthquakes)
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createLegend(map) {
    /*Legend specific*/
    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Earthquake Magnitude</h4>";
        div.innerHTML += `<i style="background: #${colorRange[0]}"></i><span><1</span><br>`;
        div.innerHTML += `<i style="background: #${colorRange[1]}"></i><span><2</span><br>`;
        div.innerHTML += `<i style="background: #${colorRange[2]}"></i><span><3</span><br>`;
        div.innerHTML += `<i style="background: #${colorRange[3]}"></i><span><4</span><br>`;
        div.innerHTML += `<i style="background: #${colorRange[4]}"></i><span><5</span><br>`;
        div.innerHTML += `<i style="background: #${colorRange[5]}"></i><span><6</span><br>`;
        div.innerHTML += `<i style="background: #${colorRange[6]}"></i><span><7</span><br>`;
        div.innerHTML += `<i style="background: #${colorRange[7]}"></i><span><8</span><br>`;
        div.innerHTML += `<i style="background: #${colorRange[8]}"></i><span>9</span><br>`;
        
        return div;
    };

    legend.addTo(map);
}


//Function to write basemap and overlay out to the map box
function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap,earthquakes]
  });

  //Write legend
  createLegend(myMap);

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
