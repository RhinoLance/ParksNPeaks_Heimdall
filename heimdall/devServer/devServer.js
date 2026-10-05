const http = require("http");
const url = require("url");
const fs = require("fs");

// Make our HTTP server
const server = http.createServer((req, res) => {
	// Website you wish to allow to connect
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);

	//	const url = new URL(req.url);
	//	const path = url.pathname;
	const path = req.url;
	console.log("Requested path: " + path + " ...");

	let responseData;
	let responseType;

	switch (path) {
		case "/?suffix=ALL":
			responseData = feedData("./data/ALL.json");
			responseType = "application/json";
			break;
		case "/?suffix=PARK/WWFF/VKFF-0994":
			responseData = getData("./data/PARK/VKFF-0994.json");
			responseType = "application/json";
			break;
		case "/?suffix=PARK/WWFF/VKFF-0490":
			responseData = getData("./data/PARK/VKFF-0490.json");
			responseType = "application/json";
			break;
		case "/?suffix=SUMMIT/VK2/CT-007":
			responseData = getData("./data/SUMMIT/VK2-CT-007.json");
			responseType = "application/json";
			break;
		case "/?suffix=SUMMIT/VK2/ST-008":
			responseData = getData("./data/SUMMIT/VK2-ST-008.json");
			responseType = "application/json";
			break;
		case "/?suffix=CALLSIGN/ZL3RIK":
			responseData = getData("./data/CALLSIGN/missing.json");
			responseType = "application/json";
			break;

		//SOTA
		case "/spots/epoch/":
			responseData = "1970-01-01T00:00:00.000Z";
			break;
		case "/spots/30/all/all/":
			responseData = feedData("./data/sota.json");
			responseType = "application/json";
			break;

		//POTA
		case "/pota/":
			responseData = feedData("./data/POTA/pota.json");
			responseType = "application/json";
			break;

		//defaults

		default:
			if (/PARK/.test(path))
				responseData = getData("./data/PARK/VKFF-0994.json");
			else if (/SUMMIT/.test(path))
				responseData = getData("./data/SUMMIT/VK2-CT-007.json");
			else if (/zlota/.test(path))
				responseData = getData("./data/zlota/assets/ZL_0566.raw");
			else if (/CALLSIGN\/ADD/.test(path))
				responseData = getData("./data/CALLSIGN/empty.txt");
			else if (/CALLSIGN\/EDIT/.test(path))
				responseData = getData("./data/CALLSIGN/empty.txt");
			else if (/CALLSIGN/.test(path))
				responseData = getData("./data/CALLSIGN/VK2JDL.json");
			else {
				res.writeHead(404);
				const error = {
					message: "Not found",
					statusCode: 404,
				};

				responseData = JSON.stringify(error);
			}
	}

	res.setHeader("Content-Type", responseType ?? "text");
	res.end(responseData);
});

const getData = (filePath) => {
	return fs.readFileSync(filePath, "utf8");
};

const dataCache = new Map();
const feedData = (filePath) => {
	let data;

	if (!dataCache.has(filePath)) {
		data = {
			lastIndex: 0,
			records: fs.readFileSync(filePath, "utf8"),
		};

		console.log(data);
	} else {
		data = dataCache.get(filePath);
	}

	const jsonData = JSON.parse(data.records);

	if (data.lastIndex >= jsonData.length) {
		return JSON.stringify(jsonData);
	}

	const start = jsonData.length - data.lastIndex;
	const end = jsonData.length;
	const returnRecords = jsonData.slice(start, end);
	data.lastIndex++;

	dataCache.set(filePath, data);

	return JSON.stringify(returnRecords);
};

// Have the server listen on port 9000
server.listen(9000);
