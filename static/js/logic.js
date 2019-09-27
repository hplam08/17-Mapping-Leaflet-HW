var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/" + "all_week.geojson"

  d3.json (link, function(data) {
    createFeatures(data.features);
  });

// Get color function - based on magnitude of the earthquakes 

function getColor(m) {
    return m > 5 ? "#bd0026":
           m > 4 ? "#f03b20":
           m > 3 ? "#fd8d3c":
           m > 2 ? "#feb24c":
           m > 1 ? "#fed976":
           "#ffffb2";

}
// style feature for the colors 

function style(feature) {
    return {
        fillColor: getColor(feature.properties.mag),
        weight: 3,
        opacity: .8,
        fillOpacity: 0.7
    };
  }

function assignRadius(value) {
  return value * 30000;
}

function createFeatures(earthquakeData) {

  // 6.1 Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.mag + " Magnitude Earthquake</h3><hr>" +
    feature.properties.place + "</h3><hr><p>" + 
    new Date(feature.properties.time) + "</p>");
  }
  
  // 6.2 Define the pointToLayer for the SIZE and COLOR variables which are not using
  // Leaflet defaults; required for non-defaults in Leaflet layers.
  function pointToLayer(feature, latlng) {
    return new L.circle(latlng, {
      radius: assignRadius(feature.properties.mag),
      fillColor: getColor(feature.properties.mag),
      color: '#0000',
      weight: .75,
      stroke: true,
      fillOpacity: .75
    })
  }

  // 6.3 Create a GeoJSON layer containing the features and pointToLayers arrays on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    style: style,
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });

  // 6.4 Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// 7.0 CREATE MAP FUNCTION
function createMap(earthquakes) {

  // 7.1 Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // 7.2 Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  // 7.3 Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // 7.4 Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 2,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Add legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [1,2,3,4,5]
    var labels = [];

    // div.innerHTML = legendInfo;
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

    return div;
  };

  // 7.7 Adding legend to the map
  legend.addTo(map);

}
