const fs = require('fs');

// Load the JSON file
let data = JSON.parse(fs.readFileSync('sitesOSM.json'));

// Convert to GeoJSON FeatureCollection
let geojson = {
    "type": "FeatureCollection",
    "features": data.map(item => ({
        "type": "Feature",
        "geometry" : {
            "type": "multipolygon",
            "coordinates": item.boundary,
        },
        "properties" : {
			"id": item.id,
			"name": item.name,
			"osmId": item.osmId
		},
    }))
};

// Save as a new GeoJSON file
fs.writeFileSync('sitesOSMConverted.geojson', JSON.stringify(geojson));