// /**
//  * Renders a progress bar.
//  * @param {Element} el The target element.
//  * @constructor
//  */
// function Progress(el) {
//   this.el = el;
//   this.loading = 0;
//   this.loaded = 0;
// }
//
//
// /**
//  * Increment the count of loading tiles.
//  */
// Progress.prototype.addLoading = function() {
//   if (this.loading === 0) {
//     this.show();
//   }
//   ++this.loading;
//   this.update();
// };
//
//
// /**
//  * Increment the count of loaded tiles.
//  */
// Progress.prototype.addLoaded = function() {
//   setTimeout(function() {
//     ++this.loaded;
//     this.update();
//   }.bind(this), 100);
// };
//
// /**
//  * Update the progress bar.
//  */
// Progress.prototype.update = function() {
//   var width = (this.loaded / this.loading * 100).toFixed(1) + "%";
//   this.el.style.width = width;
//   if (this.loading === this.loaded) {
//     this.loading = 0;
//     this.loaded = 0;
//     setTimeout(this.hide.bind(this), 500);
//   }
// };
//
//
// /**
//  * Show the progress bar.
//  */
// Progress.prototype.show = function() {
//   this.el.style.visibility = "visible";
// };
//
//
// /**
//  * Hide the progress bar.
//  */
// Progress.prototype.hide = function() {
//   if (this.loading === this.loaded) {
//     this.el.style.visibility = "hidden";
//     this.el.style.width = 0;
//   }
// };


// --------------------------------------------
// Store an object
// --------------------------------------------
// Parameters
//  - key : key
//  - object : data object
// --------------------------------------------
setStore = (function(key, object) {
    var jsonObj = JSON.stringify(object);
    sessionStorage.removeItem(key);
    sessionStorage.setItem(key, jsonObj);
});

// --------------------------------------------
// Remove an object from store
// --------------------------------------------
// Parameters
//  - key : key
// --------------------------------------------
delStore = (function(key) {
    sessionStorage.removeItem(key);
});

// --------------------------------------------
// Get a stored object
// --------------------------------------------
// Parameters
//  - key : key
// --------------------------------------------
getStore = (function(key) {
    var jsonObj = sessionStorage.getItem(key);
    return JSON.parse(jsonObj);
});

// --------------------------------------------
// JSonify a stored JSON object
// --------------------------------------------
// Parameters
//  - key : key
// --------------------------------------------
getStoreJSon = (function(key) {
    var jsonObj = getStore(key);
    return window.JSON.stringify(jsonObj, undefined, 2);
});

// --------------------------------------------
// Read capabilities (Asynchronous request)
// --------------------------------------------
// Parameters
//  - urlCapabilities : url of the apabilities
// --------------------------------------------
loadCapabilitiesCrossOrigin = (function(urlCapabilities, key) {

    var parser = new ol.parser.ogc.WMSCapabilities(),
        xmlDoc, layers;
    var mapLayers = {};

    //$(function() {
    $.ajax({
        type: "POST",
        url: urlCapabilities,
        dataType: "xml",
        success: function(data) {

                //console.log(data);
                var xmlDoc = parser.read(data);
                document.getElementById("capabilities").innerHTML = xmlDoc;
                var layers = xmlDoc.capability.layers;

                // Record each layer
                for (var l = 0; l < layers.length; ++l) {
                    var layer = layers[l];

                    // Add layer to map (key=layer.name, value=layer)
                    mapLayers[layer.name] = layer;

                    //console.log("Layer:" + layer.name);
                    //console.log("\tAvailable styles: " + layer.styles);
                    //console.log("\tAvailable times: " + layer.dimensions.time.values);
                    //console.log("\tAvailable elevations: " + layer.dimensions.elevation.values);
                }

                setStore("mapLayers", mapLayers);
                setStore(key, mapLayers);

                // Fire event when capabilities is loaded
                $("#capabilities").trigger("change");
            }
            //},
            // error: function(){
            //     progress.progressTimer("error", {
            //         errorText:"ERROR!",
            //         onFinish:function(){
            //             alert("There was an error processing your information!");
            //         }
            //     });
            // },
            // done: function(){
            //     progress.progressTimer("complete");
            // }
    });
    // progress.progressTimer("complete");
    // .error(function(){
    //     progress.progressTimer("error", {
    //         errorText:"ERROR!",
    //         onFinish:function(){
    //             alert("There was an error processing your information!");
    //         }
    //     });
    // }).done(function(){
    //     progress.progressTimer("complete");
    // });
    //});

});

// --------------------------------------------
// SPECIFIC METEO-FRANCE
// --------------------------------------------

// --------------------------------------------
// Get api token from meteo-france
// --------------------------------------------
getToken = (function(username, password) {
    var apikeyurl = "https://donneespubliques.meteofrance.fr/inspire/services/GetAPIKey?username=" + username + "&password=" + password;
    $.ajax({
        type: "POST",
        url: apikeyurl,
        //crossDomain: true,
        dataType: "xml",
        success: function(xml) {
            console.log(xml);
        },
        error: function(xhr, status) {
            alert("error, status: " + status + ", content: " + xhr);
        }
    });
});

// --------------------------------------------
// Clean session store from geoservices names
// --------------------------------------------
clearStorage = (function(geojsonfilename) {

    //$(window).one("focus", function() {
    //localStorage.clear();
    sessionStorage.clear();
    //});

    // // delete current capabilities
    // delStore("mapLayers");
    //
    // // delete all capabilities keys
    // var geojson = getStore("geojson");
    // if (geojson) {
    //   $.each(geojson.features, function( index, value ) {
    //       var propName = value.properties.name;
    //       console.log("Remove session storage for capabilities key: " + propName + "...")
    //       delStore(propName);
    //   });
    //
    //   // delete all geojson keys
    //   $.each(geojson.features, function( index, value ) {
    //       var key = buildGeojsonKey(value.properties.geojson);
    //       console.log("Remove session storage for geojson key: " + key + "...")
    //       delStore(key);
    //   });
    // }

});

// --------------------------------------------
// Return geojson key for session storage from
// geojson file
// --------------------------------------------
buildGeojsonKey = (function(geojsonFile) {
    return geojsonFile.split("\\").pop().split("/").pop();
});

// --------------------------------------------
// Get properties.name of geoservice from
// properties.service
// --------------------------------------------
// TODO better implementation: dictionnary of properties
// --------------------------------------------
getGeojsonName = (function(serviceName) {
    var found = "";
    var geojson = getStore("geojson");
    $.each(geojson.features, function(index, value) {
        if (serviceName === value.properties.url_base) {
            found = value.properties.name;
            return found;
        }
    });
    return found;
});

// --------------------------------------------
// Get geometry.coordinates of geoservice from
// properties.service
// --------------------------------------------
// TODO better implementation: dictionnary of properties
// --------------------------------------------
getGeojsonCoordinates = (function(serviceName) {
    var found = "";
    var geojson = getStore("geojson");
    $.each(geojson.features, function(index, value) {
        if (serviceName === value.properties.url_base) {
            var latlon = value.geometry.coordinates;
            found = "[" + "[" + latlon[0][0] + "," + latlon[0][1] + "]" + "," + "[" + latlon[1][0] + "," + latlon[1][1] + "]" + "]";
            return found;
        }
    });
    return found;
});

// --------------------------------------------
// Get geometry.coordinates of geoservice from
// properties.service
// --------------------------------------------
// TODO better implementation: dictionnary of properties
// --------------------------------------------
getGeojsonRessource = (function(serviceName) {
    var found = "";
    var geojson = getStore("geojson");
    $.each(geojson.features, function(index, value) {
        if (serviceName === value.properties.url_base) {
            found = value.properties.geojson;
            return found;
        }
    });
    return found;
});


// --------------------------------------------
// Get properties.documentation of geoservice from
// properties.service
// --------------------------------------------
// TODO better implementation: dictionnary of properties
// --------------------------------------------
getGeojsonDoc = (function(serviceName) {
    var found = "";
    var geojson = getStore("geojson");
    $.each(geojson.features, function(index, value) {
        if (serviceName === value.properties.url_base) {
            found = value.properties.documentation;
            return found;
        }
    });
    return found;
});

// --------------------------------------------
// Get properties.license of geoservice from
// properties.service
// --------------------------------------------
// TODO better implementation: dictionnary of properties
// --------------------------------------------
getGeojsonLic = (function(serviceName) {
    var found = "";
    var geojson = getStore("geojson");
    $.each(geojson.features, function(index, value) {
        if (serviceName === value.properties.url_base) {
            found = value.properties.license;
            return found;
        }
    });
    return found;
});

// --------------------------------------------
// Get properties.mention of geoservice from
// properties.service
// --------------------------------------------
// TODO better implementation: dictionnary of properties
// --------------------------------------------
getGeojsonMention = (function(serviceName) {
    var found = "";
    var geojson = getStore("geojson");
    $.each(geojson.features, function(index, value) {
        if (serviceName === value.properties.url_base) {
            found = value.properties.mention;
            return found;
        }
    });
    return found;
});

// --------------------------------------------
// Get properties.description of geoservice from
// properties.service
// --------------------------------------------
// TODO better implementation: dictionnary of properties
// --------------------------------------------
getGeojsonDescription = (function(serviceName) {
    var found = "";
    var geojson = getStore("geojson");
    $.each(geojson.features, function(index, value) {
        if (serviceName === value.properties.url_base) {
            found = value.properties.description;
            return found;
        }
    });
    return found;
});

// --------------------------------------------
// Get properties.site of geoservice from
// properties.service
// --------------------------------------------
// TODO better implementation: dictionnary of properties
// --------------------------------------------
getGeojsonSite = (function(serviceName) {
    var found = "";
    var geojson = getStore("geojson");
    $.each(geojson.features, function(index, value) {
        if (serviceName === value.properties.url_base) {
            found = value.properties.site;
            return found;
        }
    });
    return found;
});

// --------------------------------------------
// Read geojson (Synchronous request)
// --------------------------------------------
// Parameters
//  - geojsonfilename : name fo the json resource
// --------------------------------------------
loadGeojsonServices = (function(geojsonfilename) {
    $.getJSON(geojsonfilename, function(geojson) {
        setStore("geojson", geojson);
        // Fire event when geojson is loaded
        $("#geojson").trigger("change");
    });
});

// --------------------------------------------
// Read geojson (Synchronous request)
// --------------------------------------------
// Parameters
//  - geojsonfilename : name fo the json resource
// --------------------------------------------
loadGeojsonShoreline = (function(geojsonfilename, key){
  $.getJSON(geojsonfilename, function(geojson) {
      setStore(key, geojson);
      $("#geojsonShoreline").trigger("change");
  })
});

// --------------------------------------------
// Check if token is empty
// --------------------------------------------
isTokenEmpty = (function() {
    var token = $("#token").val();
    return (!(token) || 0 === token.length);
});

// --------------------------------------------
// Check if geoservices is empty
// --------------------------------------------
isGeoservicesEmpty = (function() {
    var geoservices = $("#geoservices").val();
    return (!(geoservices) || 0 === geoservices.length);
});

// --------------------------------------------
// Check if layers is empty
// --------------------------------------------
isLayersEmpty = (function() {
    var layers = $("#layers").val();
    return (!(layers) || 0 === layers.length);
});

// --------------------------------------------
// Check if styles is empty
// --------------------------------------------
isStylesEmpty = (function() {
    var styles = $("#styles").val();
    return (!(styles) || 0 === styles.length);
});

// --------------------------------------------
// Clear "geoservices" options
// --------------------------------------------
clearGeoservicesOptions = (function() {
    var selection = document.getElementById("geoservices");
    while (selection.firstChild) {
        selection.removeChild(selection.firstChild);
    }
});

// --------------------------------------------
// Populate "geoservices" options
// --------------------------------------------
// Parameters
//  - geoservices : list of geoservices
// --------------------------------------------
populateGeoservicesOptions = (function(geoservices) {

    var geoservicesSel = document.getElementById("geoservices");
    while (geoservicesSel.firstChild) {
        geoservicesSel.removeChild(geoservicesSel.firstChild);
    }
    var opt = document.createElement("option");
    opt.value = "EMPTY";
    opt.innerHTML = "";
    geoservicesSel.appendChild(opt);
    $("#geoservices").val("");

    for (var index in geoservices.features) {
        var feature = geoservices.features[index];
        var service_type = feature.properties.service_type;
        if (service_type === "WMS") {
            var opt = document.createElement("option");
            opt.value = feature.properties.url_base;
            opt.innerHTML = feature.properties.service;
            geoservicesSel.appendChild(opt);
        }
    }
});

// --------------------------------------------
// Clear "layers" options
// --------------------------------------------
clearLayersOptions = (function() {
    var selection = document.getElementById("layers");
    while (selection.firstChild) {
        selection.removeChild(selection.firstChild);
    }
});

// --------------------------------------------
// Populate "layers" options
// --------------------------------------------
// Parameters
//  - mapLayers : list of layers
// --------------------------------------------
populateLayersOptions = (function(mapLayers) {

    var layersSel = document.getElementById("layers");
    //var size = Object.keys(mapLayers).length;
    for (var key in mapLayers) {

        // Add layer to map (key=layer.name, value=layer)
        var layer = mapLayers[key];

        // Add layer to select
        var opt = document.createElement("option");
        opt.value = layer.name;
        opt.innerHTML = layer.name;
        layersSel.appendChild(opt);
    }

});

// --------------------------------------------
// Clear "referenceTimes" options
// --------------------------------------------
clearReferenceTimesOptions = (function() {
    var selection = document.getElementById("referenceTimes");
    while (selection.firstChild) {
        selection.removeChild(selection.firstChild);
    }
});

// --------------------------------------------
// Populate "ReferenceTime" options
// --------------------------------------------
// Parameters
//  - mapLayers : list of ReferenceTime
// --------------------------------------------
populateRefTimesOptions = (function(mapLayers) {

    var layerName = document.getElementById("layers").value;
    if (layerName || !(0 === layerName.length)) {
        var layer = mapLayers[layerName];
        var timeSel = document.getElementById("referenceTimes");
        if (undefined != layer.dimensions.reference_time) {
          var timeTab = layer.dimensions.reference_time.values;
          while (timeSel.firstChild) {
              timeSel.removeChild(timeSel.firstChild);
          }
          for (var t = 0; t < timeTab.length; ++t) {
              var value = timeTab[t];
              var opt = document.createElement("option");
              opt.value = value;
              opt.innerHTML = value;
              timeSel.appendChild(opt);
          }
        }
    }
});

// --------------------------------------------
// Clear "times" options
// --------------------------------------------
clearTimesOptions = (function() {
    var selection = document.getElementById("times");
    while (selection.firstChild) {
        selection.removeChild(selection.firstChild);
    }
});

// --------------------------------------------
// Populate "Time" options
// --------------------------------------------
// Parameters
//  - mapLayers : list of times
// --------------------------------------------
populateTimesOptions = (function(mapLayers) {

    var layerName = document.getElementById("layers").value;
    if (layerName || !(0 === layerName.length)) {
        var layer = mapLayers[layerName];
        var timeSel = document.getElementById("times");
        var timeTab = layer.dimensions.time.values;
        while (timeSel.firstChild) {
            timeSel.removeChild(timeSel.firstChild);
        }
        for (var t = 0; t < timeTab.length; ++t) {
            var value = timeTab[t];
            var opt = document.createElement("option");
            opt.value = value;
            opt.innerHTML = value;
            timeSel.appendChild(opt);
        }
    }

});

// --------------------------------------------
// Clear "formats" options
// --------------------------------------------
clearFormatsOptions = (function() {
    var selection = document.getElementById("formats");
    while (selection.firstChild) {
        selection.removeChild(selection.firstChild);
    }
});

// --------------------------------------------
// Populate "formats" options
// --------------------------------------------
// Parameters
//  - mapLayers : list of formats
// --------------------------------------------
populateFormatsOptions = (function(mapLayers) {

    var layerName = document.getElementById("layers").value;
    if (layerName || !(0 === layerName.length)) {
        var layer = mapLayers[layerName];
        var formatSel = document.getElementById("formats");
        var formatTab = layer.formats;
        while (formatSel.firstChild) {
            formatSel.removeChild(formatSel.firstChild);
        }
        for (var t = 0; t < formatTab.length; ++t) {
            var value = formatTab[t];
            var opt = document.createElement("option");
            opt.value = value;
            opt.innerHTML = value;
            formatSel.appendChild(opt);
        }
    }

});

// --------------------------------------------
// Clear "BoundingBox" options
// --------------------------------------------
clearBoundingBoxOptions = (function() {
    var selection = document.getElementById("boundingBox");
    while (selection.firstChild) {
        selection.removeChild(selection.firstChild);
    }
});

// --------------------------------------------
// Populate "BoundingBox" options
// --------------------------------------------
// Parameters
//  - mapLayers : list of formats
// --------------------------------------------
populateBoundingBoxOptions = (function(mapLayers) {

    var layerName = document.getElementById("layers").value;
    if (layerName || !(0 === layerName.length)) {
        var layer = mapLayers[layerName];
        var bbSel = document.getElementById("boundingBox");
        var bbTab = layer.llbbox;
        while (bbSel.firstChild) {
            bbSel.removeChild(bbSel.firstChild);
        }

        var latlon = "[" + "[" + bbTab[3] + "," + bbTab[0] + "]" + "," + "[" + bbTab[1] + "," + bbTab[2] + "]" + "]";
        var opt = document.createElement("option");
        opt.value = latlon;
        opt.innerHTML = latlon;
        bbSel.appendChild(opt);
    }

});

// TODO populate for SRS

// --------------------------------------------
// Clear "styles" options
// --------------------------------------------
clearStylesOptions = (function() {
    var selection = document.getElementById("styles");
    while (selection.firstChild) {
        selection.removeChild(selection.firstChild);
    }
});

// --------------------------------------------
// Populate "styles" options
// --------------------------------------------
// Parameters
//  - mapLayers : list of layers
// --------------------------------------------
populateStylesOptions = (function(mapLayers) {
    var layerName = document.getElementById("layers").value;
    if (layerName || !(0 === layerName.length)) {
        var layer = mapLayers[layerName];
        var styleSel = document.getElementById("styles");
        var styleTab = layer.styles;
        while (styleSel.firstChild) {
            styleSel.removeChild(styleSel.firstChild);
        }
        for (var t = 0; t < styleTab.length; ++t) {
            var value = styleTab[t];
            var opt = document.createElement("option");
            opt.value = value.name;
            opt.innerHTML = value.name + ": " + value.title;
            styleSel.appendChild(opt);
        }
    }
});

// --------------------------------------------
// Get legend graphics image url
// --------------------------------------------
// Parameters
//  - mapLayers : list of layers
// --------------------------------------------
getLegendGraphicImage = (function(mapLayers) {
    var legendImage;
    var layerName = $("#layers").val();
    if (layerName || !(0 === layerName.length)) {
        var layer = mapLayers[layerName];
        var styleTab = layer.styles;
        for (var t = 0; t < styleTab.length; ++t) {
            var value = styleTab[t];
            if (value.name === $("#styles").val()) {
              legendImage = value.legend.href;
              return legendImage;
            }
        }
      }
      return legendImage;
  });

// --------------------------------------------
// Populate map options from capabilities
// --------------------------------------------
// Parameters
//  - urlCapabilities : url of the capabilities
// --------------------------------------------
populateMapOptionsFromCapabilities = (function(urlCapabilities, geoserviceName) {
    // If key exist use stored session
    var keyService = getStore(geoserviceName);
    if (keyService) {
        setStore("mapLayers", keyService);
        $("#capabilities").trigger("change");
    }
    // else load from remote capabilities
    else {
        // loadCapabilitiesCrossOrigin fire event capabilities to fill combobox
        loadCapabilitiesCrossOrigin(urlCapabilities, geoserviceName);
    }
});

var map;

// --------------------------------------------
// Initialize leaflet Map
// --------------------------------------------
initWMSMap = (function() {
  if (undefined != map) {
    map.remove();
  }
  map = L.map("map", {
      center: [0, 0],
      zoom: 2,
      crs: L.CRS.EPSG4326
  });
  // L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //     attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
  //     //subdomains: ["a", "b", "c"]
  // }).addTo(map);
});

// --------------------------------------------
// Reset map
// --------------------------------------------
resetWMSMap = (function() {
    initWMSMap();
});

// --------------------------------------------
// Load a layer in the map
// --------------------------------------------
// Parameters
//  - url : url of wms
//  - layer : wms layer
//  - style : style of wms layer
//  - bounds : bounding box
// --------------------------------------------
loadWmsMap = (function(url, layer, style, time, reftime, format, bounds, uri) {
    map.remove();
    map = L.map("map", {
        center: [0, 0],
        zoom: 2,
        crs: L.CRS.EPSG4326
    });

    // L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //     attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
    //     //subdomains: ["a", "b", "c"]
    // }).addTo(map);

    // TODO :to be removed
    //L.geoJSON(geojson).addTo(map);

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

    // Add legend
    L.wmsLegend(uri);

    //fitBounds(bounds, layer);

});

// --------------------------------------------
// Adjust map to bounds
// --------------------------------------------
// Parameters
//  - bounds : string bounding box
// --------------------------------------------
fitBounds = (function(bounds, layer) {
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
// Add geojson to the map
// --------------------------------------------
// Parameters
//  - geojsonFeature : geojson data
// --------------------------------------------
addGeojsonToMap = (function(key) {
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
