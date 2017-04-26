all:
	ogr2ogr -f GeoJSON baumkataster.geojson "http://geodaten1.graz.at/ArcGIS_Graz/rest/services/Extern/OGD_WFS/MapServer/15/query?where=objectid+%3D+objectid&outfields=*&f=geojson" OGRGeoJSON
	wget https://raw.githubusercontent.com/species/OGD-Graz-Daten/master/Naturdenkmale/Naturdenkmale.geojson -O naturdenkmale.geojson
	node merge.js
	rm -rf 16 17 18
	node split.js
	rm baumkataster.geojson baeume.geojson
