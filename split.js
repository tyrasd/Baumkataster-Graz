var trees = JSON.parse(require("fs").readFileSync("./baeume.geojson", "utf8"));

var merc = new (require("sphericalmercator"))({
    size: 256*2
});

var fs = require("graceful-fs");

trees.features.forEach(function(tree) {
	tree.geometry.bbox = tree.geometry.coordinates.concat(tree.geometry.coordinates);
});

var zooms = [16,17,18];

var tiles = {};

zooms.forEach(function(zoom) {
	tiles[zoom] = {};

	trees.features.forEach(function(tree) {
		var xyz = merc.xyz(tree.geometry.bbox, zoom-1);
		var x = xyz.minX,
			y = xyz.minY;
		if (!tiles[zoom][x])
			tiles[zoom][x] = {};
		if (!tiles[zoom][x][y])
			tiles[zoom][x][y] = [];
		tiles[zoom][x][y].push(tree);
	});
});

for (var zoom in tiles) {
	try { fs.mkdirSync("./"+zoom); } catch (e) {}
	for (x in tiles[zoom]) {
		try { fs.mkdirSync("./"+zoom+"/"+x); } catch (e) {}
		for (y in tiles[zoom][x]) {
			var features = tiles[zoom][x][y];
			var geojson = {
				type: "FeatureCollection",
				features: features
			};
			fs.writeFile(
				"./"+zoom+"/"+x+"/"+y+".geojson",
				JSON.stringify(geojson, null, 2),
				function(err) { if (err) throw err; }
			);
		}
	}
}
