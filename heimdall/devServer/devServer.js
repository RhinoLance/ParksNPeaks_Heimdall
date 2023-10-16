const http = require("http");
const url = require("url");
const fs = require("fs");

// Make our HTTP server
const server = http.createServer((req, res) => {
    
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	const path = url.parse(req.url).href;
	console.log( "Requested path: " + path + " ...");

	switch( path ) {
		case "/?suffix=ALL":
			responseData = getData("./data/ALL.json");
			break;
		case "/?suffix=PARK/WWFF/VKFF-0994":
			responseData = getData("./data/PARK/VKFF-0994.json");
			break;
		case "/?suffix=PARK/WWFF/VKFF-0490":
			responseData = getData("./data/PARK/VKFF-0490.json");
			break;
		case "/?suffix=SUMMIT/VK2/CT-007":
			responseData = getData("./data/SUMMIT/VK2-CT-007.json");
			break;
		case "/?suffix=SUMMIT/VK2/ST-008":
			responseData = getData("./data/SUMMIT/VK2-ST-008.json");
			break;
		
		//defaults
		
		
		default:
		
		if( /PARK/.test(path) )
		responseData = getData("./data/PARK/VKFF-0994.json");

		else if( /SUMMIT/.test(path) )
		responseData = getData("./data/SUMMIT/VK2-CT-007.json");

		else {
			res.writeHead(404);
				const error = {
					message: "Not found",
					statusCode: 404
				};
			
			responseData = JSON.stringify(error);
		}

		

			
	
    };

	res.end( responseData);
});

const getData = (filePath) => {
	return fs.readFileSync(filePath, "utf8");
}

// Have the server listen on port 9000
server.listen(9000)