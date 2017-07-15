// Query to obtain location of Squirrels
exports.queryLocation = function(token) {

	var argument = [];
	var payload = {
	    "entities": [
	        {
	            "type": "Animal",
	            "isPattern": "true",
	            "id": ".*"
	        }
	    ],
	    "restriction": {
	      "scopes": [
	        {
	          "type" : "FIWARE::Location::NGSIv2",
	          "value" : {
	            "georel": [ "near", "minDistance:200" ],
	            "geometry": "point",
	            "coords": [ "40.925950,-4.063100" ]
	          }
	        }
	      ]
	    }
	}
	

	var payloadString = JSON.stringify(payload);

	var headers = {
		'X-Auth-Token': token,
		'Content-Type': 'application/json', 
		'Accept': 'application/json',
		'Content-Length': payloadString.length,
		'Room': 'location'
	};

	var options = {
		host: 'orion',
		port: '1026',
		path: '/v1/queryContext',
		method: 'POST',
		headers: headers
	};
  
  	argument.push(payloadString);
	argument.push(options);

	return argument;
};