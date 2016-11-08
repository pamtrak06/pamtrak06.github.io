// --------------------------------------------
// CESIUM
// --------------------------------------------
var map3d;
var layerProvider;

// --------------------------------------------
// Cesium: Initialize Map
// --------------------------------------------
initWMSMapCesium = (function() {

  map3d = new Cesium.Viewer('cesiumContainer', {
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
// Cesium: Reset map
// --------------------------------------------
resetWMSMapCesium = (function() {
    map3d.imageryLayers.remove(layerProvider, true);
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
loadWmsMapCesium = (function(url, layer, style, time, reftime, format, bounds, uri) {

  resetWMSMapCesium();

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
      //  proxy: new Cesium.DefaultProxy('/proxy/')
  });

  layerProvider = map3d.imageryLayers.addImageryProvider(provider);

});

// --------------------------------------------
// Cesium: Adjust map to bounds
// --------------------------------------------
// Parameters
//  - bounds : string bounding box
// --------------------------------------------
fitBoundsCesium = (function(bounds, layer) {
});

// --------------------------------------------
// Cesium: Add geojson to the map
// --------------------------------------------
// Parameters
//  - geojsonFeature : geojson data
// --------------------------------------------
addGeojsonToMapCesium = (function(geojsonkey) {
});
