// Values for update Televison Room
exports.updateTelevisionContext = function(token, tvName, tvValue, powerValue){

	var argument = [];
	var payload = {};
	payload[tvName] = {"value": tvValue, "type": "Integer"}
	payload["Power_consumed"] = {"value": powerValue, "type": "Integer"}

	var payloadString = JSON.stringify(payload);

	var headers = {
		'X-Auth-Token': token,
		'Content-Type': 'application/json', 
		'Room': 'switch'
	};

	var options = {
		host: 'pepproxy',
		port: '8070',
		path: '/v2/entities/Television_Room/attrs',
		method: 'PATCH',
		headers: headers
	};
  
  	argument.push(payloadString);
	argument.push(options);

	return argument;
};

// Values for update Chocolate Room
exports.updateWaterfallContext = function(token, waterValue){

	var argument = [];
	var payload = {};
	payload["Waterfall_speed"] = {"value": waterValue, "type": "Integer"}

	var payloadString = JSON.stringify(payload);

	var headers = {
		'X-Auth-Token': token,
		'Content-Type': 'application/json', 
		'Room': 'waterfall'
	};

	var options = {
		host: 'pepproxy',
		port: '8070',
		path: '/v2/entities/Chocolate_Room/attrs',
		method: 'PATCH',
		headers: headers
	};
  
  	argument.push(payloadString);
	argument.push(options);

	return argument;
};

// Values for update Chocolate Room
exports.updateRiverContext = function(token, riverValue){

	var argument = [];
	var payload = {};
	payload["River_level"] = {"value": riverValue, "type": "Integer"}

	var payloadString = JSON.stringify(payload);

	var headers = {
		'X-Auth-Token': token,
		'Content-Type': 'application/json', 
		'Room': 'waterfall'
	};

	var options = {
		host: 'pepproxy',
		port: '8070',
		path: '/v2/entities/Chocolate_Room/attrs',
		method: 'PATCH',
		headers: headers
	};
  
  	argument.push(payloadString);
	argument.push(options);

	return argument;
};