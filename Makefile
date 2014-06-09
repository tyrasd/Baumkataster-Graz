all:
	wget https://github.com/species/OGD-Graz-Daten/raw/master/Baumkataster/baumkataster.geojson -O baumkataster.geojson
	node split.js