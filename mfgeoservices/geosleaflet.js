// --------------------------------------------
// LEAFLET
// --------------------------------------------
var map;

// --------------------------------------------
// Leaflet: Initialize Map
// --------------------------------------------
initWMSmapLeaflet = (function() {
  if (undefined != map) {
    map.remove();
  }
  map = L.map("map", {
      center: [0, 0],
      zoom: 2,
      crs: L.CRS.EPSG4326
  });
});

// --------------------------------------------
// Leaflet: Reset map
// --------------------------------------------
resetWMSmapLeaflet = (function() {
    initWMSmapLeaflet();
});

// --------------------------------------------
// Leaflet: Load a layer in the map
// --------------------------------------------
// Parameters
//  - url      : url of wms
//  - layer    : wms layer
//  - style    : style of wms layer
//  - time     : time
//  - reftime  : reference time
//  - format   : format
//  - bounds   : bounding box
//  - uri      : legend url
// --------------------------------------------
loadWmsmapLeaflet = (function(url, layer, style, time, reftime, format, bounds, uri) {
    map.remove();
    map = L.map("map", {
        center: [0, 0],
        zoom: 2,
        crs: L.CRS.EPSG4326
    });

    var transparent = false;
    if (format === "image/png") {
        transparent = true;
    }

    if (time) {
      url = url + "&time=" + time;
    }
    if (reftime) {
      url = url + "&reference_time=" + reftime;
    }

    var wmsLayer = L.tileLayer.wms(url, {
        layers: layer,
        styles: style,
        format: format,
        transparent: transparent,
        version: "1.3.0",
        attribution: "Source: Meteo-France",
        onEachFeature: function (feature, layer) {
        	layer.options.zIndex = feature.id + 10;
        }
    }).addTo(map);

    L.wmsLegend(uri);

});

// --------------------------------------------
// Leaflet: Adjust map to bounds
// --------------------------------------------
// Parameters
//  - bounds : string bounding box
// --------------------------------------------
fitBoundsLeaflet = (function(bounds, layer) {
  try {
    var bb = JSON.parse(bounds);
    // create an orange rectangle
    L.rectangle(JSON.parse(bounds), {color: "#ff7800", weight: 1}).addTo(map);
    if (bounds) {
      map.fitBounds(JSON.parse(bounds));
    }
  } catch(err) {
    console.error("layer: "+layer+", error caught on bounding box: " + bounds);
    map.fitBounds([[90.0,-180.0],[-90.0,180.0]]);
  }
});

// --------------------------------------------
// Leaflet: Add geojson to the map
// --------------------------------------------
// Parameters
//  - geojsonFeature : geojson data
// --------------------------------------------
addGeojsonTomapLeaflet = (function(key) {
  var geojsonFeature = getStore(key);
  L.geoJSON(geojsonFeature, { // no need to use "new" with "L.geoJson", which does a "new L.GeoJSON" (note the case difference).
    style: {
    	opacity: 0.5
    },
    onEachFeature: function (feature, layer) {
    	layer.options.zIndex = feature.id + 20;
    }
  }).addTo(map);
});
