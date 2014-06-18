var trees = JSON.parse(require("fs").readFileSync("./baumkataster.geojson", "utf8"));
var natur = JSON.parse(require("fs").readFileSync("./naturdenkmale.geojson", "utf8"));

function dist(p1, p2) {
	var R = 6371000;
	var λ1 = p1[0] * Math.PI/180,
		λ2 = p2[0] * Math.PI/180,
		φ1 = p1[1] * Math.PI/180,
		φ2 = p2[1] * Math.PI/180;
	var x = (λ2-λ1) * Math.cos((φ1+φ2)/2);
	var y = (φ2-φ1);
	var d = Math.sqrt(x*x + y*y) * R;
	return d;
}

natur.features.forEach(function(naturdenkmal) {
	var minDist = Infinity,
		best;
	trees.features.forEach(function(tree) {
		if (tree.properties.Naturdenkmal)
			return;
		var d = dist(tree.geometry.coordinates, naturdenkmal.geometry.coordinates);
		if (d < minDist) {
			minDist = d;
			best = tree;
		}
	});
	if (minDist < 5.0) {
		best.properties.Naturdenkmal = true;
		best.properties.Naturdenkmal_Eigentum = naturdenkmal.properties.EIGENTUM;
	} else {
		if (naturdenkmal.properties.EIGENTUM === "öffentlich") {
			console.log("Warning: no match found for public Naturdenkmal #"+naturdenkmal.properties.NUMMER+" (best candidate @ "+Math.round(minDist)+"m)");
		}
		trees.features.push({
			type: "Feature",
			properties: {
				Naturdenkmal: true,
				Naturdenkmal_Eigentum: naturdenkmal.properties.EIGENTUM,
				nummer: "Naturdenkmal-"+naturdenkmal.properties.NUMMER,
				objectid: "Naturdenkmal-"+naturdenkmal.properties.OBJECTID,
				baumbezeichnung_deutsch: naturdenkmal.properties.BAUMART.split(' (')[0],
				baumbezeichnung_botanisch: naturdenkmal.properties.BAUMART.match(/\((.*)\)/) ? naturdenkmal.properties.BAUMART.match(/\((.*)\)/)[1] : null
			},
			geometry: naturdenkmal.geometry
		});
	}
});

require("fs").writeFileSync("baeume.geojson", JSON.stringify(trees));