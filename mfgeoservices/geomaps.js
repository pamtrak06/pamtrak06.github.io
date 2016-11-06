// --------------------------------------------
// LEAFLET
// --------------------------------------------
var map;

// --------------------------------------------
// CESIUM
// --------------------------------------------
var map3d;

// --------------------------------------------
// Initialize Map
// --------------------------------------------
initWMSMap = (function() {
    initWMSmap2D();
    //initWMSMap3D();
});

// --------------------------------------------
// Leaflet: Initialize Map
// --------------------------------------------
initWMSmap2D = (function() {
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
// Cesium: Initialize Map
// --------------------------------------------
initWMSMap3D = (function() {

  map3d = new Cesium.Viewer('map3D', {
    imageryProvider : Cesium.createTileMapServiceImageryProvider({
      url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
    }),
    baseLayerPicker: false,
    fullscreenButton: false,
    homeButton: false,
    sceneModePicker: true,
    selectionIndicator: true,
    timeline: false,
    animation: false,
    geocoder: false
  });

});

// --------------------------------------------
// Reset Map
// --------------------------------------------
resetWMSMap = (function() {
    resetWMSmap2D();
    //resetWMSMap3D();
});


// --------------------------------------------
// Leaflet: Reset map
// --------------------------------------------
resetWMSmap2D = (function() {
    initWMSmap2D();
});

// --------------------------------------------
// Cesium: Reset map
// --------------------------------------------
resetWMSMap3D = (function() {
    //initWMSMap3D();
});

// --------------------------------------------
// Load a layer in the map
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
loadWmsMap = (function(url, layer, style, time, reftime, format, bounds, uri) {
    loadWmsmap2D(url, layer, style, time, reftime, format, bounds, uri);
    //loadWmsMap3D(url, layer, style, time, reftime, format, bounds, uri);
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
loadWmsmap2D = (function(url, layer, style, time, reftime, format, bounds, uri) {
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
// Cesium: Load a layer in cesium
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
loadWmsMap3D = (function(url, layer, style, time, reftime, format, bounds, uri) {

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

  var provider = new Cesium.WebMapServiceImageryProvider({
      url : url,
      layers : layer,
      parameters : {
          version     : '1.3.0',
          transparent : transparent,
          format : format,
          crs    : 'EPSG:4326',
          bbox   : '-90,-180,90,0',
          styles : style
      },
      //proxy: new Cesium.DefaultProxy('/proxy/')
  });

  map3d.imageryLayers.addImageryProvider(provider);

});

// --------------------------------------------
// Adjust map to bounds
// --------------------------------------------
fitBounds = (function(bounds, layer) {
    fitBounds2D(bounds, layer);
    //fitBounds3D(bounds, layer);
});

// --------------------------------------------
// Leaflet: Adjust map to bounds
// --------------------------------------------
// Parameters
//  - bounds : string bounding box
// --------------------------------------------
fitBounds2D = (function(bounds, layer) {
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
// Cesium: Adjust map to bounds
// --------------------------------------------
// Parameters
//  - bounds : string bounding box
// --------------------------------------------
fitBounds3D = (function(bounds, layer) {
});

// --------------------------------------------
// Add geojson to the map
// --------------------------------------------
// Parameters
//  - geojsonFeature : geojson data
// --------------------------------------------
addGeojsonToMap = (function(key) {
    addGeojsonTomap2D(key);
    //addGeojsonToMap3D(key);
});

// --------------------------------------------
// Leaflet: Add geojson to the map
// --------------------------------------------
// Parameters
//  - geojsonFeature : geojson data
// --------------------------------------------
addGeojsonTomap2D = (function(key) {
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

// --------------------------------------------
// Cesium: Add geojson to the map
// --------------------------------------------
// Parameters
//  - geojsonFeature : geojson data
// --------------------------------------------
addGeojsonToMap3D = (function(key) {
});
