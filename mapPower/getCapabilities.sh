#!/bin/sh
curl "http://geo.weather.gc.ca/geomet/?lang=E&SERVICE=wms&REQUEST=GetCapabilities" > ./WMSCapabilities.xml
