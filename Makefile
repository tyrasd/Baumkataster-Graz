all:
	wget https://raw.githubusercontent.com/species/OGD-Graz-Daten/master/Baumkataster/baumkataster.geojson -O baumkataster.geojson
	wget https://raw.githubusercontent.com/species/OGD-Graz-Daten/master/Naturdenkmale/Naturdenkmale.geojson -O naturdenkmale.geojson
	node merge.js
	node split.js
