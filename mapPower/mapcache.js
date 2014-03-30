
// ---------------------------------------
// Build a mapacache.xml file from
// a WMS capabilies xml file
// ---------------------------------------
buildMapcacheXml = (function(capabilitiesFile) {
    var parser = new ol.parser.ogc.WMSCapabilities(), result;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', capabilitiesFile, true);

    /**
     * onload handler for the XHR request.
     */
    xhr.onload = function(){
        if (xhr.status == 200) {
            result = parser.read(xhr.responseXML);
            //document.getElementById('capabilities').innerHTML = window.JSON.stringify(result, undefined, 2);
            layers = result.capability.layers;

            var project = 'geometca';
            var mapcache = '';
            var tileset = '';
            var source = '';
            var concat = '&amp;';
            var idx = url.indexOf('?');
            if (idx == -1) {
                concat = '?';
            }

            mapcache = '&lt;?xml version="1.0" encoding="UTF-8"?&gt;\n';
            mapcache += '&lt;mapcache&gt;\n';
            mapcache += '  &lt;metadata&gt;\n';
            mapcache += '    &lt;title&gt;Mapcache service for url: ' + url + '&lt;/title&gt;\n';
            mapcache += '    &lt;abstract&gt;Render map services for url: ' + url + '&lt;/abstract&gt;\n';
            mapcache += '  &lt;/metadata&gt;\n\n';


            // Cache: Disk
            mapcache += '  &lt;cache name="disk" type="disk"&gt;\n';
            mapcache += '    &lt;base&gt;/tmp/' + project + '&lt;/base&gt;\n';
            mapcache += '    &lt;symlink_blank/&gt;\n';
            mapcache += '  &lt;/cache&gt;\n\n';

            // Cache: template
            mapcache += '  &lt;cache name="tmpl" type="disk"&gt;\n';
            mapcache += '    &lt;base&gt;/tmp' + project + '&lt;/base&gt;\n';
            mapcache += '    &lt;template&gt;/tmp/' + project + '/template/{tileset}#{grid}#{dim}/{z}/{x}/{y}.{ext}&lt;/template&gt;\n';
            mapcache += '  &lt;/cache&gt;\n\n';

            // Cache: sqlite
            mapcache += '  &lt;cache name="sqlite" type="sqlite3"&gt;\n';
            mapcache += '    &lt;dbfile&gt;/tmp/' + project + '/sqlitetiles.db&lt;/dbfile&gt;\n';
            mapcache += '    &lt;pragma name="key"&gt;value&lt;/pragma&gt;\n';
            mapcache += '  &lt;/cache&gt;\n\n';

            // Cache: MbTiles
            mapcache += '  &lt;cache name="mbtiles" type="mbtiles"&gt;\n';
            mapcache += '    &lt;dbfile&gt;/tmp/' + project + '/' + project + '.mbtiles&lt;/dbfile&gt;\n';
            mapcache += '  &lt;/cache&gt;\n\n';

            // Format: png
            mapcache += '  &lt;format name="PNGQ_FAST" type ="PNG"&gt;\n';
            mapcache += '    &lt;compression&gt;fast&lt;/compression&gt;\n';
            mapcache += '    &lt;colors&gt;256&lt;/colors&gt;\n';
            mapcache += '  &lt;/format&gt;\n\n';

            // Format: jpeg
            mapcache += '  &lt;format name="JPEG_75" type ="JPEG"&gt;\n';
            mapcache += '    &lt;quality&gt;75&lt;/quality&gt;\n';
            mapcache += '    &lt;photometric&gt;RGB&lt;/photometric&gt;\n';
            mapcache += '  &lt;/format&gt;\n\n';

            // Format: png
            mapcache += '  &lt;format name="PNG_BEST" type ="PNG"&gt;\n';
            mapcache += '    &lt;compression&gt;best&lt;/compression&gt;\n';
            mapcache += '  &lt;/format&gt;\n\n';

            // Format: mixed
            mapcache += '  &lt;format name="mixed" type="MIXED"&gt;\n';
            mapcache += '    &lt;transparent&gt;PNG_BEST&lt;/transparent&gt;\n';
            mapcache += '    &lt;opaque&gt;JPEG&lt;/opaque&gt;\n';
            mapcache += '  &lt;/format&gt;\n\n';

            for (var l = 0; l < layers.length; ++l) {
                layer = layers[l];

                console.log('Layer:' + layer.name);
                console.log('\tAvailable elevations: ' + layer.dimensions.elevation.values);
                console.log('\tAvailable times: ' + layer.dimensions.time.values);

                var arrayTab = layer.styles;
                for (var s = 0; s < arrayTab.length; ++s) {
                    style = arrayTab[s];

                    tileset = layer.name + '_' + style.name;
                    source = 'SOURCE_' + layer.name + '_' + style.name;

                    mapcache += '  &lt;!-- Source for layer: ' + layer.name + ', style: ' + style.name + ' --&gt;\n';
                    mapcache += '  &lt;source name="' + source + '" type="wms"&gt;\n';
                    mapcache += '    &lt;http&gt;\n';
                    mapcache += '      &lt;url&gt;' + url + '&lt;/url&gt;\n';
                    mapcache += '    &lt;/http&gt;\n';
                    mapcache += '    &lt;getmap&gt;\n';
                    mapcache += '      &lt;params&gt;\n';
                    mapcache += '        &lt;FORMAT&gt;image/png&lt;/FORMAT&gt;\n';
                    mapcache += '        &lt;LAYERS&gt;' + layer.name + '&lt;/LAYERS&gt;\n';
                    mapcache += '        &lt;STYLES&gt;' + style.name + '&lt;/STYLES&gt;\n';
                    mapcache += '      &lt;/params&gt;\n';
                    mapcache += '    &lt;/getmap&gt;\n';
                    mapcache += '  &lt;/source&gt;\n\n';

                    mapcache += '  &lt;!-- Tileset for layer: ' + layer.name + ', style: ' + style.name + ' --&gt;\n';
                    mapcache += '  &lt;tileset name="' + tileset + '"&gt;\n';
                    mapcache += '    &lt;source&gt;' + source + '&lt;/source&gt;\n';
                    mapcache += '    &lt;dimensions&gt;\n';
                    mapcache += '      &lt;dimension type="regex" name="elevation" default="-1"&gt;.*&lt;/dimension&gt;\n';
                    mapcache += '      &lt;dimension type="regex" name="time" default="2000-01-00T00:00:00Z"&gt;.*&lt;/dimension&gt;\n';
                    mapcache += '    &lt;/dimensions&gt;\n';
                    mapcache += '    &lt;cache&gt;disk&lt;/cache&gt;\n';
                    mapcache += '    &lt;format&gt;PNG&lt;/format&gt;\n';

                    // TODO : create grid for each srs
                    //var projs = layer.srs;
                    //for (var p = 0; p < projs.length; ++p) {
                    //    proj = projs[p];
                    //    mapcache += '    &lt;grid&gt;' + proj + '&lt;/grid&gt;\n';
                    //}

                    mapcache += '    &lt;grid&gt;WGS84&lt;/grid&gt;\n';
                    mapcache += '    &lt;grid&gt;GoogleMapsCompatible&lt;/grid&gt;\n';
                    mapcache += '    &lt;metatile&gt;5 5&lt;/metatile&gt;\n';
                    mapcache += '    &lt;metabuffer&gt;10&lt;/metabuffer&gt;\n';
                    mapcache += '  &lt;/tileset&gt;\n\n';

                }
            }

            // Services: wms
            mapcache += '  &lt;service type="wms" enabled="true"&gt;\n';
            for (var l = 0; l < layers.length; ++l) {
                layer = layers[l];
                var arrayTab = layer.styles;
                for (var s = 0; s < arrayTab.length; ++s) {
                    style = arrayTab[s];
                    tileset = layer.name + '_' + style.name;
                    source = 'SOURCE_' + layer.name + '_' + style.name;
                    mapcache += '    &lt;forwarding_rule name="RULE' + tileset + '"&gt\n';
                    mapcache += '      &lt;param name="SERVICE" type="values"&gt;WMS&lt;/param&gt\n';
                    mapcache += '      &lt;param name="LAYERS" type="values"&gt;' + layer.name + '&lt;/param&gt\n';
                    mapcache += '      &lt;param name="STYLES" type="values"&gt;' + style.name + '&lt;/param&gt\n';
                    mapcache += '      &lt;http&gt\n';
                    mapcache += '        &lt;url&gt;' + url + concat + 'LAYERS=' + tileset + '&lt;/url&gt\n';
                    mapcache += '      &lt;/http&gt\n';
                    mapcache += '    &lt;/forwarding_rule&gt\n';

                }
            }
            mapcache += '    &lt;full_wms&gt;assemble&lt;/full_wms&gt\n';
            mapcache += '    &lt;resample_mode&gt;bilinear&lt;/resample_mode&gt\n';
            mapcache += '    &lt;format&gt;JPEG_75&lt;/format&gt\n';
            mapcache += '    &lt;maxsize&gt;4096&lt;/maxsize&gt\n';
            mapcache += '  &lt;/service&gt\n\n';

            // Services: wmts, tms, gmaps, ve, demo
            mapcache += '  &lt;service type="wmts" enabled="true"/&gt;\n';
            mapcache += '  &lt;service type="tms" enabled="true"/&gt;\n';
            mapcache += '  &lt;service type="kml" enabled="true"/&gt;\n';
            mapcache += '  &lt;service type="gmaps" enabled="true"/&gt;\n';
            mapcache += '  &lt;service type="ve" enabled="true"/&gt;\n';
            mapcache += '  &lt;service type="demo" enabled="true"/&gt;\n\n';

            // General parameters
            mapcache += '  &lt;errors&gt;report&lt;/errors&gt;\n';
            mapcache += '  &lt;lock_dir&gt;/tmp/' + project + '&lt;/lock_dir&gt;\n';
            mapcache += '  &lt;threaded_fetching&gt;true&lt;/threaded_fetching&gt;\n';
            mapcache += '  &lt;log_level&gt;debug&lt;/log_level&gt;\n';
            mapcache += '  &lt;auto_reload&gt;true&lt/auto_reload&gt; \n';


            mapcache += '&lt;/mapcache&gt;\n';

    return mapcache;
}
    };
    xhr.send();
});
