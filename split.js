var trees = JSON.parse(require("fs").readFileSync("./baeume.geojson", "utf8"));

var merc = new (require("sphericalmercator"))({
    size: 256*2
});

var fs = require("graceful-fs");

var zooms = [16,17,18];

var tiles = {};

zooms.forEach(function(zoom) {
        console.log("start zoom ",zoom);
	tiles[zoom] = {};

	trees.features.forEach(function(tree) {
		var xyz = merc.xyz(tree.geometry.coordinates.concat(tree.geometry.coordinates), zoom-1);
		var x = xyz.minX,
		    y = xyz.minY;
		if (!tiles[zoom][x])
			tiles[zoom][x] = {};
		if (!tiles[zoom][x][y])
			tiles[zoom][x][y] = [];
		tiles[zoom][x][y].push(tree);
	});
        console.log("done zoom ",zoom);
});

for (var zoom in tiles) {
        console.log("write zoom ",zoom);
	try { fs.mkdirSync("./"+zoom); } catch (e) {}
	for (x in tiles[zoom]) {
		try { fs.mkdirSync("./"+zoom+"/"+x); } catch (e) {}
		for (y in tiles[zoom][x]) {
			var features = tiles[zoom][x][y];
			var geojson = {
				type: "FeatureCollection",
				features: features
			};
			/*fs.writeFile(
				"./"+zoom+"/"+x+"/"+y+".geojson",
				JSON.stringify(geojson, null, 2),
				function(err) { if (err) throw err; }
			);*/
			fs.writeFileSync(
				"./"+zoom+"/"+x+"/"+y+".geojson",
				JSON.stringify(geojson, null, 2)
			);
		}
	}
        console.log("written zoom ",zoom);
}
