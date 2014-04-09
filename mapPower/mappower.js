
// --------------------------------------------
// Store an object
// --------------------------------------------
// Parameters
//  - key : key
//  - object : data object
// --------------------------------------------
setStore = (function(key, object){
    var jsonObj = JSON.stringify(object);
    sessionStorage.removeItem(key);
    sessionStorage.setItem(key, jsonObj);
});

// --------------------------------------------
// Get a stored object
// --------------------------------------------
// Parameters
//  - key : key
// --------------------------------------------
getStore = (function(key){
    var jsonObj = sessionStorage.getItem(key);
    return JSON.parse(jsonObj);
});

// --------------------------------------------
// JSonify a stored JSON object
// --------------------------------------------
// Parameters
//  - key : key
// --------------------------------------------
getStoreJSon = (function(key){
    var jsonObj = getStore(key);
    return window.JSON.stringify(jsonObj, undefined, 2);
});

// --------------------------------------------
// Read capabilities (Synchronous request)
// --------------------------------------------
// Parameters
//  - urlCapabilities : url of the capabilities
// --------------------------------------------
loadCapabilities = (function(urlCapabilities){
    var xmlDoc;
    var layers;
    var parser = new ol.parser.ogc.WMSCapabilities(), xmlDoc, layers;
    var xhr = new XMLHttpRequest();
    var mapLayers = {};
    
    xhr.open('GET', urlCapabilities, false);
    xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.send(null);
    
    if (xhr.status === 200) {
        xmlDoc = parser.read(xhr.responseXML);
        setStore('capabilities', window.JSON.stringify(xmlDoc, undefined, 2));
        layers = xmlDoc.capability.layers;
        
        // Record each layer
        for (var l = 0; l < layers.length; ++l) {
            var layer = layers[l];
            
            // Add layer to map (key=layer.name, value=layer)
            mapLayers[layer.name] = layer;
            
            // console.log('Layer:' + layer.name);
            // console.log('\tAvailable styles: ' + layer.styles);
            // console.log('\tAvailable times: ' + layer.dimensions.time.values);
            // console.log('\tAvailable elevations: ' + layer.dimensions.elevation.values);
        
        }
    }
    
    setStore("mapLayers", mapLayers);
    
    return mapLayers;
    
});

// --------------------------------------------
// Read capabilities (Asynchronous request)
// --------------------------------------------
// Parameters
//  - urlCapabilities : url of the apabilities
// --------------------------------------------
loadCapabilitiesAsync = (function(urlCapabilities){
    var parser = new ol.parser.ogc.WMSCapabilities(), xmlDoc, layers;
    var xhr = new XMLHttpRequest();
    var mapLayers = {};
    
    xhr.open('GET', urlCapabilities, true);
    /**
     * onload handler for the XHR request.
     */
    xhr.onload = function(){
        if (xhr.status == 200) {
            var xmlDoc = parser.read(xhr.responseXML);
            document.getElementById('capabilities').innerHTML = window.JSON.stringify(xmlDoc, undefined, 2);
            var layers = xmlDoc.capability.layers;
            
            // Record each layer
            for (var l = 0; l < layers.length; ++l) {
                var layer = layers[l];
                
                // Add layer to map (key=layer.name, value=layer)
                mapLayers[layer.name] = layer;
                
                //console.log('Layer:' + layer.name);
                //console.log('\tAvailable styles: ' + layer.styles);
                //console.log('\tAvailable times: ' + layer.dimensions.time.values);
                //console.log('\tAvailable elevations: ' + layer.dimensions.elevation.values);
            
            }
        }
    };
    xhr.send();
    
    setStore("mapLayers", mapLayers);
    
    return mapLayers;
});


// --------------------------------------------
// Populate map options from capabilities
// --------------------------------------------
// Parameters
//  - urlCapabilities : url of the apabilities
// --------------------------------------------
populateMapOptionsFromCapabilities = (function(urlCapabilities){

    var mapLayers = loadCapabilities(urlCapabilities);
    
    populateLayersOptions(mapLayers);
    
    populateStylesOptions(mapLayers);
    populateTimesOptions(mapLayers);
    populateElevationsOptions(mapLayers);
    
});

// --------------------------------------------
// Populate 'layers' options
// --------------------------------------------
// Parameters
//  - mapLayers : list of layers
// --------------------------------------------
populateLayersOptions = (function(mapLayers){

    var layersSel = document.getElementById('layers');
    //var size = Object.keys(mapLayers).length;
    for (var key in mapLayers) {
    
        // Add layer to map (key=layer.name, value=layer)
        var layer = mapLayers[key];
        
        // Add layer to select
        var opt = document.createElement('option');
        opt.value = layer.name;
        opt.innerHTML = layer.name;
        layersSel.appendChild(opt);
    }
    
});

// --------------------------------------------
// Populate 'styles' options
// --------------------------------------------
// Parameters
//  - mapLayers : list of layers
// --------------------------------------------
populateStylesOptions = (function(mapLayers){
    var layerName = document.getElementById('layers').value;
    var layer = mapLayers[layerName];
    var styleSel = document.getElementById('styles');
    var styleTab = layer.styles;
    while (styleSel.firstChild) {
        styleSel.removeChild(styleSel.firstChild);
    }
    for (var t = 0; t < styleTab.length; ++t) {
        var value = styleTab[t];
        var opt = document.createElement('option');
        opt.value = value.name;
        opt.innerHTML = value.name + ': ' + value.title;
        styleSel.appendChild(opt);
    }
});



// --------------------------------------------
// Populate 'times' options
// --------------------------------------------
// Parameters
//  - mapLayers : list of layers
// --------------------------------------------
populateTimesOptions = (function(mapLayers){
    var layerName = document.getElementById('layers').value;
    var layer = mapLayers[layerName];
    var timesSel = document.getElementById('times');
    var arrayTab = layer.dimensions.time.values;
    while (timesSel.firstChild) {
        timesSel.removeChild(timesSel.firstChild);
    }
    for (var i = 0; i < arrayTab.length; ++i) {
        var timeTab = layer.dimensions.time.values[i].split('/');
        if (timeTab.length == 3) {
            // TODO parse time
            var start = timeTab[0];
            var end = timeTab[1];
            var step = timeTab[2].substring("PT".length, timeTab[2].indexOf("H"));
            // ISO 8601 extended format : YYYY-MM-DDTHH:mm:ss.sssZ
            var startDate = new Date(start);
            var endDate = new Date(end);
            var value;
            while (startDate < endDate) {
                startDate.setUTCHours(startDate.getUTCHours() + parseInt(step));
                value = startDate.toISOString().substring(0, startDate.toISOString().length - 5) + 'Z';
                var opt = document.createElement('option');
                opt.value = value;
                opt.innerHTML = value;
                timesSel.appendChild(opt);
            }
            document.getElementById('times').value = value;
        }
    }
});


// --------------------------------------------
// Populate 'elevations' options
// --------------------------------------------
// Parameters
//  - mapLayers : list of layers
// --------------------------------------------
populateElevationsOptions = (function(mapLayers){
    var layerName = document.getElementById('layers').value;
    var layer = mapLayers[layerName];
    var elevSel = document.getElementById('elevations');
    var elevTab = layer.dimensions.elevation.values;
    while (elevSel.firstChild) {
        elevSel.removeChild(elevSel.firstChild);
    }
    for (var t = 0; t < elevTab.length; ++t) {
        var value = elevTab[t];
        var opt = document.createElement('option');
        opt.value = value;
        opt.innerHTML = value;
        elevSel.appendChild(opt);
    }
});

// --------------------------------------------
// Update layer options : styles, times, elevations
//  from selected layer name
// --------------------------------------------
updateLayerOptions = (function(){
    var mapLayers = getStore("mapLayers");
    populateStylesOptions(mapLayers);
    populateTimesOptions(mapLayers);
    populateElevationsOptions(mapLayers);
});


// --------------------------------------------
// Build layer world from geojson file
// --------------------------------------------
buildLayerWorld = (function(){
    return new ol.layer.Image({
        visible: true,
        opacity: 0.5,
        source: new ol.source.ImageVector({
            source: new ol.source.GeoJSON({
                projection: 'EPSG:4326',
                url: 'countries.geojson'
            }),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.6)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#319FD3',
                    width: 1
                })
            })
        })
    });
    
});

// --------------------------------------------
// Configure layer world loaded from geojson file
// --------------------------------------------
configureLayerWorld = (function(map, layer){
    var featureOverlay = new ol.FeatureOverlay({
        map: map,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#f00',
                width: 1
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.1)'
            })
        })
    });
    
    var highlight;
    var displayFeatureInfo = function(pixel){
    
        var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer){
            return feature;
        });
        
        var info = document.getElementById('info');
        if (feature) {
            info.innerHTML = feature.getId() + ': ' + feature.get('name');
        }
        else {
            info.innerHTML = '&nbsp;';
        }
        
        if (feature !== highlight) {
            if (highlight) {
                featureOverlay.removeFeature(highlight);
            }
            if (feature) {
                featureOverlay.addFeature(feature);
            }
            highlight = feature;
        }
        
    };
    
    $(map.getViewport()).on('mousemove', function(evt){
        var pixel = map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel);
    });
    
    map.on('singleclick', function(evt){
        displayFeatureInfo(evt.pixel);
    });
});

// --------------------------------------------
// Build a new WMTS map
// --------------------------------------------
// Parameters
//  - mapUrl : wmts url
//  - mapDiv : div id for the map
//  - tileset : name of the layer (mapcache = [layer]_[style] )
//  - time : time
//  - elevation : elevation
// --------------------------------------------
buildMapWmts = (function(mapUrl, mapDiv, tileset, time, elevation){
    var EXTENT_ = [-180, -90, 180, 90];
    var PROJ_ = 'EPSG:4326';
    var MATRIXSET_ = 'WGS84';
    
    // Reset Map : remove all div childs
    while (mapDiv.firstChild) {
        mapDiv.removeChild(mapDiv.firstChild);
    }
    var projection = ol.proj.get(PROJ_);
    var projectionExtent = projection.getExtent();
    //var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(18);
    var matrixIds = new Array(18);
    for (var z = 0; z < 18; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        //resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = z;
    }
    
    // MapCache WGS84 resolutions : http://mapserver.org/fr/mapcache/config.html
    resolutions[0] = 0.703125000000000;
    resolutions[1] = 0.351562500000000;
    resolutions[2] = 0.175781250000000;
    resolutions[3] = 8.78906250000000e-2;
    resolutions[4] = 4.39453125000000e-2;
    resolutions[5] = 2.19726562500000e-2;
    resolutions[6] = 1.09863281250000e-2;
    resolutions[7] = 5.49316406250000e-3;
    resolutions[8] = 2.74658203125000e-3;
    resolutions[9] = 1.37329101562500e-3;
    resolutions[10] = 6.86645507812500e-4;
    resolutions[11] = 3.43322753906250e-4;
    resolutions[12] = 1.71661376953125e-4;
    resolutions[13] = 8.58306884765625e-5;
    resolutions[14] = 4.29153442382812e-5;
    resolutions[15] = 2.14576721191406e-5;
    resolutions[16] = 1.07288360595703e-5;
    resolutions[17] = 5.36441802978516e-6;
    
    var sep = '?';
    if (mapUrl.indexOf(sep) != -1) {
        sep = '&';
    }
    
    sourceWmts = new ol.source.WMTS({
        url: mapUrl + sep + 'time=' + time + '&elevation=' + elevation,
        layer: tileset,
        matrixSet: MATRIXSET_,
        format: 'image/png',
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        extent: EXTENT_
        //style: 'default'
    });
    
    dataLayer = new ol.layer.Tile({
        style: 'DataStyle',
        opacity: 0.7,
        visible: true,
        source: sourceWmts
    });
    
    // ol3 normalized tile coordinates (origin bottom left),
    tileLayer = new ol.layer.Tile({
        style: 'TileStyle',
        visible: false,
        source: new ol.source.TileDebug({
            projection: PROJ_,
            tileGrid: new ol.tilegrid.XYZ({
                maxZoom: 18
            })
        })
    });
    
    // Build layer of the world
    worldLayer = buildLayerWorld();
    
    
    // bind a checkbox with id 'Times' to tile's layer's visibility
    var tileGrid = new ol.dom.Input(document.getElementById('tile-grid'));
    tileGrid.bindTo('checked', tileLayer, 'visible');
    
    var world = new ol.dom.Input(document.getElementById('world'));
    world.bindTo('checked', worldLayer, 'visible');
    
    
    // bind a checkbox with id 'Times' to tile's layer's visibility
    //                var layersInput = new ol.dom.Input(document.getElementById('layers'));
    //                layersInput.bindTo('value', sourceWmts, 'layer');
    
    var layers = [dataLayer, tileLayer, worldLayer];
    var mapWmts = new ol.Map({
        //controls: ol.control.defaults().extend([new ol.control.FullScreen()]),
        //controls: ol.control.defaults().extend([mousePositionControl]),
        //controls: ol.control.defaults().extend([new ol.control.ZoomToMaxExtent()]),
        controls: ol.control.defaults().extend([new ol.control.ScaleLine()]),
        layers: layers,
        renderer: 'canvas',
        target: 'map',
        view: new ol.View2D({
            center: [0, 0],
            zoom: 0,
            maxResolution: resolutions[2]
        })
    });
    
    configureLayerWorld(mapWmts, worldLayer);
    
    zoomslider = new ol.control.ZoomSlider();
    fullScreen = new ol.control.FullScreen();
    extent = new ol.control.ZoomToExtent();
    mapWmts.addControl(zoomslider);
    mapWmts.addControl(fullScreen);
    mapWmts.addControl(extent);
    
    
    return mapWmts;
    
});


// --------------------------------------------
// Build a new WMS map
// --------------------------------------------
// Parameters
//  - mapUrl : wms url
//  - mapDiv : div id for the map
//  - layer : name of the layer
//  - time : time
//  - elevation : elevation
// --------------------------------------------
buildMapWms = (function(mapUrl, mapWmsDiv, layer, style, time, elevation){
    var PROJ_ = 'EPSG:4326';
    var EXTENT_ = [-180.0, -90.0, 180.0, 90.0];
    
    // Reset Map : remove all div childs
    while (mapWmsDiv.firstChild) {
        mapWmsDiv.removeChild(mapWmsDiv.firstChild);
    }
	
	// Compute projection
    var projection = ol.proj.configureProj4jsProjection({
        code: PROJ_,
        extent: EXTENT_
    });
    
	// url first separator
    var sep = '?';
    if (mapUrl.indexOf(sep) != -1) {
        sep = '&';
    }
    
    dataLayer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            url: mapUrl + sep + 'time=' + time + '&elevation=' + elevation,
            crossOrigin: null,
            attributions: [new ol.Attribution({
                html: '&copy; ' +
                '<a href="http://dd.meteo.gc.ca/doc/LICENCE_GENERAL.txt' +
                '">' +
                'Data source : Environnement Canada</a>'
            })],
            params: {
                'LAYERS': layer,
                'STYLES': style,
                'FORMAT': 'image/png'
            },
            extent: EXTENT_
        })
    });
    
    
    
    // Build layer of the world
    worldLayer = buildLayerWorld();
    
    
    var world = new ol.dom.Input(document.getElementById('world'));
    world.bindTo('checked', worldLayer, 'visible');
    
    
    var layers = [dataLayer, worldLayer];
    var mapWms = new ol.Map({
        //controls: ol.control.defaults().extend([new ol.control.FullScreen()]),
        //controls: ol.control.defaults().extend([mousePositionControl]),
        //controls: ol.control.defaults().extend([new ol.control.ZoomToMaxExtent()]),
        controls: ol.control.defaults().extend([new ol.control.ScaleLine()]),
        layers: layers,
        renderer: 'canvas',
        target: 'map',
        view: new ol.View2D({
            projection: projection,
            center: [0, 0],
            extent: EXTENT_,
            zoom: 2
        })
    });
    
    configureLayerWorld(mapWms, worldLayer);
    
    zoomslider = new ol.control.ZoomSlider();
    fullScreen = new ol.control.FullScreen();
    extent = new ol.control.ZoomToExtent();
    mapWms.addControl(zoomslider);
    mapWms.addControl(fullScreen);
    mapWms.addControl(extent);
    
    
    return mapWms;
    
});

// --------------------------------------------
// Build a new WMTS map from div id's
// --------------------------------------------
buildMapWmtsFromDiv = (function(){

    // Dom parameters
    var mapUrl = document.getElementById('mapUrl').value;
    var mapDiv = document.getElementById('map');
    var tileset = document.getElementById('layers').value + '_' + document.getElementById('styles').value;
    var time = document.getElementById('times').value;
    var elevation = document.getElementById('elevations').value;
    
    return buildMapWmts(mapUrl, mapDiv, tileset, time, elevation);
});

// --------------------------------------------
// Build a new WMS map from div id's
// --------------------------------------------
buildMapWmsFromDiv = (function(){

    // Dom parameters
    var mapUrl = document.getElementById('mapUrl').value;
    var mapDiv = document.getElementById('map');
    var layer = document.getElementById('layers').value;
    var style = document.getElementById('styles').value;
    var time = document.getElementById('times').value;
    var elevation = document.getElementById('elevations').value;
    
    return buildMapWms(mapUrl, mapDiv, layer, style, time, elevation);
});

// --------------------------------------------
// Build a new map from div id's
// --------------------------------------------
buildMapFromDiv = (function(){
    var service = document.getElementById('service').value;
    if (service == 'WMS') {
        buildMapWmsFromDiv();
    }
    else {
        buildMapWmtsFromDiv();
    }
});

updateService = (function(){
    if (service == 'WMS') {
        document.getElementById("mapUrl").value = 'http://geo.weather.gc.ca/geomet/?lang=E';
    }
    else {
        document.getElementById("mapUrl").value = 'http://127.0.0.1/mapcache/wmts/';
    }
});

init = (function(){
    document.getElementById("mapUrl").value = 'http://geo.weather.gc.ca/geomet/?lang=E';
    populateMapOptionsFromCapabilities('WMSCapabilities.xml');
    buildMapFromDiv();
});
