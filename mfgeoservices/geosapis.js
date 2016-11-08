// --------------------------------------------
// Initialize Map
// --------------------------------------------
initWMSMap = (function(key) {

  switch(key) {
    case "cesium":
        initWMSMapCesium();
        break;
    case "leaflet":
        initWMSmapLeaflet();
        break;
    default:
        initWMSmapLeaflet();
  }
});

// --------------------------------------------
// Reset Map
// --------------------------------------------
resetWMSMap = (function(key) {

  switch(key) {
    case "cesium":
        resetWMSMapCesium();
        break;
    case "leaflet":
        resetWMSmapLeaflet();
        break;
    default:
        resetWMSmapLeaflet();
  }

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
loadWmsMap = (function(key, url, layer, style, time, reftime, format, bounds, uri) {

  switch(key) {
    case "cesium":
        loadWmsMapCesium(url, layer, style, time, reftime, format, bounds, uri);
        break;
    case "leaflet":
        loadWmsmapLeaflet(url, layer, style, time, reftime, format, bounds, uri);
        break;
    default:
        loadWmsmapLeaflet(url, layer, style, time, reftime, format, bounds, uri);
  }

});

// --------------------------------------------
// Adjust map to bounds
// --------------------------------------------
fitBounds = (function(key, bounds, layer) {

  switch(key) {
    case "cesium":
        fitBoundsCesium(bounds, layer);
        break;
    case "leaflet":
        fitBoundsLeaflet(bounds, layer);
        break;
    default:
        fitBoundsLeaflet(bounds, layer);
  }

});

// --------------------------------------------
// Add geojson to the map
// --------------------------------------------
// Parameters
//  - geojsonFeature : geojson data
// --------------------------------------------
addGeojsonToMap = (function(key, geojsonkey) {

  switch(key) {
    case "cesium":
        addGeojsonToMapCesium(geojsonkey);
        break;
    case "leaflet":
        addGeojsonTomapLeaflet(geojsonkey);
        break;
    default:
        addGeojsonTomapLeaflet(geojsonkey);
  }

});
