all:
	rm baumkataster.geojson; ogr2ogr -f GeoJSON baumkataster.geojson "http://geodaten1.graz.at/ArcGIS_Graz/rest/services/Extern/OGD_WFS/MapServer/15/query?where=objectid+%3D+objectid&outfields=*&f=json" OGRGeoJSON || wget https://raw.githubusercontent.com/species/OGD-Graz-Daten/master/Baumkataster/baumkataster.geojson -O baumkataster.geojson
	wget https://raw.githubusercontent.com/species/OGD-Graz-Daten/master/Naturdenkmale/Naturdenkmale.geojson -O naturdenkmale.geojson
	node merge.js
	node split.js
