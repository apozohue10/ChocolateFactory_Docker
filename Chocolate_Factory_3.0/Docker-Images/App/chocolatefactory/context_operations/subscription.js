var http = require('http');


exports.subscribeChocolateContext = function(callback){

var payload = {
    "entities": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Chocolate Room"
        }
    ],
    "attributes": [
        "Temperature",
        "Pressure",
        "Waterfall speed",
        "Occupation",
        "River level"
    ],
    "reference": "http://138.4.7.25:1028/contextResponseCR",
    "duration": "PT3M",
    "notifyConditions": [
        {
            "type": "ONCHANGE",
            "condValues": [
                "Temperature",
                "Pressure",
                "Waterfall speed",
                "Occupation",
                "River level"

            ]
        }
    ],
    "throttling": "PT5S"
};

var payloadString = JSON.stringify(payload);
  var headers = {
  'Content-Type': 'application/json', 
  'Accept': 'application/json',
  'Content-Length': payloadString.length
};

var options = {
  host: 'localhost',
    port: '8080',
    path: '/v1/subscribeContext',
    method: 'POST',
    headers: headers
};


var req = http.request(options, function(res) {
  res.setEncoding('utf-8');
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.on('data', function (data) {
   // console.log(data);
  });

  res.on('end', function() {
    console.log("Reponse end");
  });
});

req.on('error', function(e) {
  console.log('Problem with request');
});

req.write(payloadString);
req.end();

};


exports.subscribeInventingContext = function(callback){

	var payload = {
    "entities": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Inventing Room"
        }
    ],
   "attributes": [
        "Temperature",
        "Pressure",
        "Experimental Chewing Gum size",
        "Experiments volatility",
        "Occupation"
    ],
    "reference": "http://138.4.7.25:1028/contextResponseIR",
    "duration": "PT3M",
    "notifyConditions": [
        {
            "type": "ONCHANGE",
            "condValues": [
                "temperature",
                "pressure",
                "Experimental Chewing Gum size",
                "Experiments volatility",
                "Occupation"
            ]
        }
    ],
    "throttling": "PT5S"
};

  var payloadString = JSON.stringify(payload);

  var headers = {
  'Content-Type': 'application/json', 
  'Accept': 'application/json',
  'Content-Length': payloadString.length
};

var options = {
  host: 'localhost',
    port: '8080',
    path: '/v1/subscribeContext',
    method: 'POST',
    headers: headers
};

var req = http.request(options, function(res) {
  res.setEncoding('utf-8');
  //console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.on('data', function (data) {
   // console.log(data);
  });

  res.on('end', function() {
    console.log("Subcribed to the Inventing Room context");
  });
});

req.on('error', function(e) {
  console.log('Problem with rhe Inventing Room subscription');
});

req.write(payloadString);
req.end();
};

exports.subscribeTelevisionContext = function(callback){

  var payload = {
    "entities": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Television Room"
        }
    ],
   "attributes": [
        "Temperature",
        "Pressure",
        "TVs on",
        "Power consumed",
        "Occupation"
    ],
    "reference": "http://138.4.7.25:1028/contextResponseTR",
    "duration": "PT3M",
    "notifyConditions": [
        {
            "type": "ONCHANGE",
            "condValues": [
                "Temperature",
                "Pressure",
                "TVs on",
                "Power consumed",
                "Occupation"
            ]
        }
    ],
    "throttling": "PT5S"
};

  var payloadString = JSON.stringify(payload);

  var headers = {
  'Content-Type': 'application/json', 
  'Accept': 'application/json',
  'Content-Length': payloadString.length
};

var options = {
  host: 'localhost',
    port: '8080',
    path: '/v1/subscribeContext',
    method: 'POST',
    headers: headers
};

var req = http.request(options, function(res) {
  res.setEncoding('utf-8');
  //console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.on('data', function (data) {
   // console.log(data);
  });

  res.on('end', function() {
    console.log("Subcribed to the Television Room context");
  });
});

req.on('error', function(e) {
  console.log('Problem with the Television Room subscription');
});

req.write(payloadString);
req.end();
};

exports.subscribeHallContext = function(callback){

  var payload = {
    "entities": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Big hall"
        }
    ],
   "attributes": [
        "Temperature",
        "Pressure",
        "Occupation"
    ],
    "reference": "http://138.4.7.25:1028/contextResponseHall",
    "duration": "PT3M",
    "notifyConditions": [
        {
            "type": "ONCHANGE",
            "condValues": [
                "Temperature",
                "Pressure",
                "Occupation"
            ]
        }
    ],
    "throttling": "PT5S"
};

  var payloadString = JSON.stringify(payload);

  var headers = {
  'Content-Type': 'application/json', 
  'Accept': 'application/json',
  'Content-Length': payloadString.length
};

var options = {
  host: 'localhost',
    port: '8080',
    path: '/v1/subscribeContext',
    method: 'POST',
    headers: headers
};

var req = http.request(options, function(res) {
  res.setEncoding('utf-8');
  //console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.on('data', function (data) {
   // console.log(data);
  });

  res.on('end', function() {
    console.log("Subcribed to the Big Hall context");
  });
});

req.on('error', function(e) {
  console.log('Problem with the Big Hallsubscription');
});

req.write(payloadString);
req.end();
};

exports.subscribeOfficeContext = function(callback){

  var payload = {
    "entities": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Willy wonka office"
        }
    ],
   "attributes": [
        "Temperature",
        "Pressure",
        "Occupation"
    ],
    "reference": "http://138.4.7.25:1028/contextResponseOffice",
    "duration": "PT3M",
    "notifyConditions": [
        {
            "type": "ONCHANGE",
            "condValues": [
                "Temperature",
                "Pressure",
                "Occupation"
            ]
        }
    ],
    "throttling": "PT5S"
};

  var payloadString = JSON.stringify(payload);

  var headers = {
  'Content-Type': 'application/json', 
  'Accept': 'application/json',
  'Content-Length': payloadString.length
};

var options = {
  host: 'localhost',
    port: '8080',
    path: '/v1/subscribeContext',
    method: 'POST',
    headers: headers
};

var req = http.request(options, function(res) {
  res.setEncoding('utf-8');
  //console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.on('data', function (data) {
   // console.log(data);
  });

  res.on('end', function() {
    console.log("Subcribed to the Big Hall context");
  });
});

req.on('error', function(e) {
  console.log('Problem with the Big Hallsubscription');
});

req.write(payloadString);
req.end();
};

exports.subscribeElevatorContext = function(callback){

  var payload = {
    "entities": [
        {
            "type": "Transportation",
            "isPattern": "false",
            "id": "Elevator"
        }
    ],
   "attributes": [
        "Temperature",
        "Pressure",
        "Floor",
        "Occupation"
    ],
    "reference": "http://138.4.7.25:1028/contextResponseElevator",
    "duration": "PT3M",
    "notifyConditions": [
        {
            "type": "ONCHANGE",
            "condValues": [
                "Temperature",
                "Pressure",
                "Floor",
                "Occupation"
            ]
        }
    ],
    "throttling": "PT5S"
};

  var payloadString = JSON.stringify(payload);

  var headers = {
  'Content-Type': 'application/json', 
  'Accept': 'application/json',
  'Content-Length': payloadString.length
};

var options = {
  host: 'localhost',
    port: '8080',
    path: '/v1/subscribeContext',
    method: 'POST',
    headers: headers
};

var req = http.request(options, function(res) {
  res.setEncoding('utf-8');
  //console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.on('data', function (data) {
   // console.log(data);
  });

  res.on('end', function() {
    console.log("Subcribed to the Elevator context");
  });
});

req.on('error', function(e) {
  console.log('Problem with the Elevator subscription');
});

req.write(payloadString);
req.end();
};

exports.unsubscribeContext = function(subscriptionID){

	var payload = {

		"subscriptionId": subscriptionID
	};

  var payloadString = JSON.stringify(payload);

  var headers = {
  'Content-Type': 'application/json', 
  'Accept': 'application/json',
  'Content-Length': payloadString.length
	};

var options = {
  host: 'localhost',
    port: '8080',
    path: '/v1/unsubscribeContext',
    method: 'POST',
    headers: headers
};

var req = http.request(options, function(res) {
  res.setEncoding('utf-8');
  //console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.on('data', function (data) {
   // console.log(data);
  });

  res.on('end', function() {
    console.log("Unsubscribed  from the  Room context with ID: " + subscriptionID);
  });
});

req.on('error', function(e) {
  console.log('Problem with the Room unsubscription');
});

req.write(payloadString);
req.end();
};