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
        "url": "http://172.0.75.2:1028/contextResponseCR"
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
    "throttling": 1
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
        "url": "http://172.0.75.2:1028/contextResponseIR"
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
          "TV1_on",
          "TV2_on",
          "TV3_on",
          "TV4_on",
          "TV5_on",
          "TV6_on",
          "TV7_on",
          "TV8_on",
          "TV9_on",
          "TV10_on",
          "Occupation",
          "Power_consumed"
        ]
      }
    },
    "notification": {
      "http": {
        "url": "http://172.0.75.2:1028/contextResponseTR"
      },
      "attrs": [
          "Temperature",
          "Pressure",
          "TV1_on",
          "TV2_on",
          "TV3_on",
          "TV4_on",
          "TV5_on",
          "TV6_on",
          "TV7_on",
          "TV8_on",
          "TV9_on",
          "TV10_on",
          "Occupation",
          "Power_consumed"
      ]
    },
    "expires": "2040-01-01T14:00:00.00Z",
    "throttling": 1
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

    var payload = {
      "description": "Subscription to get info about all sensors",
      "subject": {
        "entities": [
          {
            "idPattern": ".*"
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
          "url": "http://172.0.75.2:1028/contextResponseAR"
        },
        "attrs": [
          "Occupation"
        ]
      },
      "expires": "2040-01-01T14:00:00.00Z",
      "throttling": 1
    };
    var payloadString = JSON.stringify(payload);
    argument.push(payloadString);

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
      "description": "Subscription to get info about all sensors",
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
          "url": "http://172.0.75.2:1028/contextResponseARA"
        },
        "attrs": []
      },
      "expires": "2040-01-01T14:00:00.00Z",
      "throttling": 2
    };
    var payloadString = JSON.stringify(payload);
    argument.push(payloadString);

  return argument;
};
