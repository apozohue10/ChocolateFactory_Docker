var http = require('http');


// Unsubscribe from a room with subscriptionID
exports.unsubscribeContext = function(token, subscriptionID){

  var payload = {
    "status": "inactive"
  };

  var payloadString = JSON.stringify(payload);

  var headers = {
    'X-Auth-Token': token,
    'Content-Type': 'application/json', 
    'Room': 'Unsubscribe',
  };

pathUnsubscribe = '/v2/subscriptions/' + subscriptionID

var options = {
    host: 'pepproxy',
    port: '8070',
    path: pathUnsubscribe,
    method: 'PATCH',
    headers: headers
};

var req = http.request(options, function(res) {
  res.setEncoding('utf-8');
  console.log('STATUS: ' + res.statusCode);
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

// Values for subscription on Chocolate Room
exports.subscribeChocolateContext = function(token){


  var argument = [];
  var payload = {
    "description": "Subscription to get info about Chocolate Room",
    "subject": {
      "entities": [
        {
          "id": "Chocolate_Room",
          "type": "Room"
        }
      ],
      "condition": {
        "attrs": [
          "Temperature",
          "Pressure",
          "Waterfall_speed",
          "Occupation",
          "River_level"
        ]
      }
    },
    "notification": {
      "http": {
        "url": "http://172.18.0.8:1028/contextResponseCR"
      },
      "attrs": [
        "Temperature",
        "Pressure",
        "Waterfall_speed",
        "Occupation",
        "River_level"
      ]
    },
    "expires": "2040-01-01T14:00:00.00Z",
    "throttling": 5
  };

  var payloadString = JSON.stringify(payload);

  var headers = {
    'X-Auth-Token': token,
    'Content-Type': 'application/json', 
    'Room': 'Chocolate Room',
  };

  var options = {
    host: 'pepproxy',
    port: '8070',
    path: '/v2/subscriptions',
    method: 'POST',
    headers: headers
  };


  argument.push(payloadString);
  argument.push(options);

  return argument;

};

// Values for subscription on Inventing Room
exports.subscribeInventingContext = function(token){

  var argument = [];
  var payload = {
    "description": "Subscription to get info about Inventing Room",
    "subject": {
      "entities": [
        {
          "id": "Inventing_Room",
          "type": "Room"
        }
      ],
      "condition": {
        "attrs": [
          "Temperature",
          "Pressure",
          "Experimental_Chewing_Gum_size",
          "Occupation",
          "Experiments_volatility"
        ]
      }
    },
    "notification": {
      "http": {
        "url": "http://172.18.0.8:1028/contextResponseIR"
      },
      "attrs": [
        "Temperature",
        "Pressure",
        "Experimental_Chewing_Gum_size",
        "Occupation",
        "Experiments_volatility"
      ]
    },
    "expires": "2040-01-01T14:00:00.00Z",
    "throttling": 5
  };

  var payloadString = JSON.stringify(payload);

  var headers = {
    'X-Auth-Token': token,
    'Content-Type': 'application/json', 
    'Room': 'Inventing Room',
  };

  var options = {
    host: 'pepproxy',
    port: '8070',
    path: '/v2/subscriptions',
    method: 'POST',
    headers: headers
  };

  argument.push(payloadString);
  argument.push(options);

  return argument;

};


// Values for subscription on Televison Room
exports.subscribeTelevisionContext = function(token){

  var argument = [];
  var payload = {
    "description": "Subscription to get info about Television Room",
    "subject": {
      "entities": [
        {
          "id": "Television_Room",
          "type": "Room"
        }
      ],
      "condition": {
        "attrs": [
          "Temperature",
          "Pressure",
          "TVs_on",
          "Occupation",
          "Power_consumed"
        ]
      }
    },
    "notification": {
      "http": {
        "url": "http://172.18.0.8:1028/contextResponseTR"
      },
      "attrs": [
          "Temperature",
          "Pressure",
          "TVs_on",
          "Occupation",
          "Power_consumed"
      ]
    },
    "expires": "2040-01-01T14:00:00.00Z",
    "throttling": 5
  };

  var payloadString = JSON.stringify(payload);

  var headers = {
    'X-Auth-Token': token,
    'Content-Type': 'application/json', 
    'Room': 'Television Room',
  };

  var options = {
    host: 'pepproxy',
    port: '8070',
    path: '/v2/subscriptions',
    method: 'POST',
    headers: headers
  };

  argument.push(payloadString);
  argument.push(options);

  return argument;
};

// Values for subscription on Admin Map
// PROBAR SUBSCRIPCION SOLO UN REQUEST PARA COMPROBAR CUAL ES MAS RAPIDO
exports.subscribeAdminMapContext = function(token){

  var argument = [];

  var headers = {
    'X-Auth-Token': token,
    'Content-Type': 'application/json', 
    'Room': 'Admin Map',
  };

  var options = {
    host: 'pepproxy',
    port: '8070',
    path: '/v2/subscriptions',
    method: 'POST',
    headers: headers
  };

  argument.push(options);

  var arrayRooms = ["Chocolate_Room", "Inventing_Room", "Television_Room", "Big_hall", "Willy_wonka_office", "Elevator"];
  for ( i=0 ; i < arrayRooms.length; i++) {
    var payload = {
      "description": "Subscription to get info about Occupation",
      "subject": {
        "entities": [
          {
            "id": arrayRooms[i],
          }
        ],
        "condition": {
          "attrs": [
            "Occupation"
          ]
        }
      },
      "notification": {
        "http": {
          "url": "http://172.18.0.8:1028/contextResponseAR"
        },
        "attrs": [
            "Occupation"
        ]
      },
      "expires": "2040-01-01T14:00:00.00Z",
      "throttling": 5
    };
    var payloadString = JSON.stringify(payload);
    argument.push(payloadString);
  }

  return argument;
};

// Values for subscription on Admin Room
exports.subscribeAdminRoomContext = function(token){

  var argument = [];

  var headers = {
    'X-Auth-Token': token,
    'Content-Type': 'application/json', 
    'Room': 'Admin Room',
  };

  var options = {
    host: 'pepproxy',
    port: '8070',
    path: '/v2/subscriptions',
    method: 'POST',
    headers: headers
  };

  argument.push(options);

    var payload = {
      "description": "Subscription to get info about Occupation",
      "subject": {
        "entities": [
          {
            "idPattern": ".*"
          }
        ],
        "condition": {
          "attrs": []
        }
      },
      "notification": {
        "http": {
          "url": "http://172.18.0.8:1028/contextResponseARA"
        },
        "attrs": []
      },
      "expires": "2040-01-01T14:00:00.00Z",
      "throttling": 5
    };
    var payloadString = JSON.stringify(payload);
    argument.push(payloadString);

  return argument;
};

/**
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
    "reference": "http://172.18.0.8:1028/contextResponseHall",
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
  host: 'orion',
    port: '1026',
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
    "reference": "http://172.18.0.8:1028/contextResponseOffice",
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
  host: 'orion',
    port: '1026',
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
    "reference": "http://172.18.0.8:1028/contextResponseElevator",
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
  host: 'orion',
    port: '1026',
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

*/
