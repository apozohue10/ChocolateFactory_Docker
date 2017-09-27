var http = require('http');

var probMatrix = {}
probMatrix.en = {
  el:0.1,
  tr:0.3, 
  ir:0.5,
  cr:0.95,
  en:1
};
probMatrix.cr = {
  en:0.2,
  cr:1,
};
probMatrix.tr = {
  en:0.1,
  tr:1
};
probMatrix.ir = {
  en:0.1,
  ir:1
};

probMatrix.wi = {
  el:0.4,
  wi:1,
};

probMatrix.el = {
  sf:0.4,
  wi:0.7, 
  en:1
};

probMatrix.sf = {
  el:0.3,
  sf:1, 
};

var oc0 = 150;
var zonesOc = {cr:0,en:oc0,tr:0,ir:0,wi:0,el:0,sf:0};


function changeZone(a, b){
  if(a!=0){
  a=a-1; b=b+1;
  }
}

setInterval(function(){

var dice = randomNumber(0,1);
if(zonesOc.en > 0){
  if(dice <= probMatrix.en.el){
    zonesOc.en-=1; zonesOc.el+=1; 
  } else if(dice > probMatrix.en.el && dice <= probMatrix.en.tr){
    zonesOc.en-=1; zonesOc.tr+=1;
  } else if(dice > probMatrix.en.tr && dice <= probMatrix.en.ir){
    zonesOc.en-=1; zonesOc.ir+=1;
  } else if(dice > probMatrix.en.ir && dice <= probMatrix.en.cr){
    zonesOc.en-=1; zonesOc.cr+=1;
  } else if(dice > probMatrix.en.cr && dice <= probMatrix.en.en){
  }
}

if(dice <= probMatrix.cr.en && zonesOc.cr>0){
  zonesOc.cr-=1; zonesOc.en+=1;
}

if(dice <= probMatrix.tr.en && zonesOc.tr>0){
    zonesOc.tr-=1; zonesOc.en+=1;
}

if(dice <= probMatrix.ir.en && zonesOc.ir>0){
  zonesOc.ir-=1; zonesOc.en+=1;
}

if(dice <= probMatrix.wi.el && zonesOc.wi>0){
  zonesOc.wi-=1; zonesOc.el+=1;
}

var dice3 = randomNumber(0, 1);
if(zonesOc.el>0){
  if(dice <= probMatrix.el.sf){
    zonesOc.el-=1; zonesOc.sf+=1;
  } else if(dice > probMatrix.el.sf || dice >= probMatrix.el.wi){
    zonesOc.el-=1; zonesOc.wi+=1;
  } else if(dice > probMatrix.en.wi || dice >= probMatrix.en.en){
    zonesOc.el-=1; zonesOc.en+=1;
  }
}
if(zonesOc.sf>0){
  if(dice <= probMatrix.sf.el){
    zonesOc.sf-=1; zonesOc.el+=1;
  }
}
/*
console.log(dice);
console.log("Entrada:"+ zonesOc.en);
console.log("Willy:"+ zonesOc.wi);
console.log("Inventing:"+ zonesOc.ir);
console.log("Television:"+ zonesOc.tr);
console.log("Second:"+ zonesOc.sf);
console.log("Chocolate:"+ zonesOc.cr);
console.log("Elevator:"+ zonesOc.el);
*/
}, 1000);


function randomNumber(low, high){
    return Math.random()*(high-low)+low;
  }

function randomInt(low, high){
    return Math.floor(Math.random() * (high - low)) + low;
  }

 function changeTemp(temp){
 	var deltat = randomNumber(0,2);
 	var dice = randomInt(0,1);
 	if(dice == 1){
 		return temp - deltat;
 	} else {
 		return temp + deltat;
 	}
 }

 function changePres(pres){
 	var deltap = randomInt(0,50);
 	var dice = randomInt(0,1);
 	if(dice == 1){
 		return pres - deltap;
 	} else {
 		return pres + deltap;
 	}
 }


exports.updateChocolateRoom = function(callback){
	setInterval(function(){

	function changelevel(rlevel){
		var n = randomInt(0, 1);
    if(n==0){
      rlevel+=randomInt(1,5);
    } else {
      rlevel-=randomInt(1,5);
    }
    return rlevel;
	}

	var temperature = changeTemp(26)
	var pressure = changePres(750);
	var rlevel = changelevel(50);
	var wspeed = randomNumber(10, 50);
	var payload = {
	"contextElements": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Chocolate Room",
            "attributes": [
              {
                "name": "Temperature",
                "type": "float",
                "value": temperature
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": pressure
            },
            {
               "name": "Waterfall speed",
               "type": "float",
               "value": wspeed
            },
            {
              "name": "River level",
              "type": "integer",
              "value": rlevel
            },
            {
              "name": "Occupation",
              "type": "integer",
              "value": zonesOc.cr
           }
           ]
       }
   ],
    "updateAction": "UPDATE"
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
    path: '/v1/updateContext',
    method: 'POST',
    headers: headers
};

var req = http.request(options, function(res) {
  res.setEncoding('utf-8');
  //console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.on('data', function (data) {
    //console.log(data);
  });

  res.on('end', function() {
   //console.log("Updated context for Chocolate Room");
  });
});

req.on('error', function(e) {
  console.log('Problem with request in the Chocolate Room');
});

req.write(payloadString);
req.end();
},1000);
};

exports.updateInventingRoom = function(callback){
  setInterval(function(){

  function changeVolatility(){
    var n = randomInt(0, 500);
    if(n > 300){
      return "low";
    } else if(n < 300 && n < 400){
      return "medium";
    } else if(n > 400 && n > 480) {
      return "high";
    } else { 
      return "Max";
    }
  }

  var temperature = changeTemp(24);
  var pressure = changePres(760);
  var expVol = changeVolatility();
  var chSz = randomNumber(10, 50);


  var payload = {
  "contextElements": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Inventing Room",
            "attributes": [
              {
                "name": "Temperature",
                "type": "float",
                "value": temperature
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": pressure
            },
            {
                "name": "Experimental Chewing Gum size",
                "type": "float",
                "value": chSz
            },
            {
                "name": "Experiments volatility",
                "type": "string",
                "value": expVol
            },
            {
                "name": "Occupation",
                "type": "integer",
                "value": zonesOc.ir
            }
           ]
       }
   ],
    "updateAction": "UPDATE"
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
    path: '/v1/updateContext',
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
   //console.log("Updated context for Inventing Room");
  });
});

req.on('error', function(e) {
  console.log('Problem with request in the Inventing Room');
});

req.write(payloadString);
req.end();
},2000);
};

exports.updateTelevisionRoom = function(callback){
  setInterval(function(){

  function powerConsumed(nTVs){
    return 322*nTVs;
  }

  var temperature = changeTemp(23);
  var pressure = changePres(740);
  var nTV = randomInt(10, 30);
  var power = powerConsumed(nTV);
  var payload = {
  "contextElements": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Television Room",
            "attributes": [
              {
                "name": "Temperature",
                "type": "float",
                "value": temperature
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": pressure
            }, 
            {
                "name": "TVs on",
                "type": "integer",
                "value": nTV
            },
            {
             "name": "Power consumed",
                "type": "float",
                "value": power
            },
            {
             "name": "Occupation",
                "type": "integer",
                "value": zonesOc.tr
            }
            ]
        }
   ],
    "updateAction": "UPDATE"
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
    path: '/v1/updateContext',
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
   // console.log("Updated context for Television Room");
  });
});

req.on('error', function(e) {
  console.log('Problem with request in the Television Room');
});

req.write(payloadString);
req.end();
},2000);
};

exports.updateHall = function(callback){
  setInterval(function(){

  var temperature = changeTemp(23);
  var pressure = changePres(750);

  var payload = {
  "contextElements": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Big hall",
            "attributes": [
            {
                "name": "Temperature",
                "type": "float",
                "value": temperature
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": pressure
            },
            {
             "name": "Occupation",
                "type": "integer",
                "value": zonesOc.en
            }
            ]
        }
   ],
    "updateAction": "UPDATE"
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
    path: '/v1/updateContext',
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
  // console.log("Updated context for the Big Hall(entrance)");
  });
});

req.on('error', function(e) {
  console.log('Problem with request in the Big Hall(entrance)');
});

req.write(payloadString);
req.end();
},2000);
};

exports.updateOffice = function(callback){
  setInterval(function(){

  var temperature = changeTemp(23);
  var pressure = changePres(750);

  var payload = {
  "contextElements": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Willy wonka office",
            "attributes": [
            {
                "name": "Temperature",
                "type": "float",
                "value": temperature
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": pressure
            },
            {
             "name": "Occupation",
                "type": "integer",
                "value": zonesOc.wi
            }
            ]
        }
   ],
    "updateAction": "UPDATE"
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
    path: '/v1/updateContext',
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
   // console.log("Updated context for the Willy Wonka's Office");
  });
});

req.on('error', function(e) {
  console.log('Problem with request in the Willy Wonkas Office');
});

req.write(payloadString);
req.end();
},2000);
};

exports.updateElevator= function(callback){
  setInterval(function(){
  var temperature = changeTemp(24);
  var pressure = changePres(720);
  var theFloor = randomInt(0, 2);

  var payload = {
   "contextElements": [
        {
            "type": "Transportation",
            "isPattern": "false",
            "id": "Elevator",
            "attributes": [
            {
                "name": "Temperature",
                "type": "float",
                "value": temperature
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": pressure
            },
            {
                "name": "Floor",
                "type": "integer",
                "value": theFloor
            },
            {
                "name": "Occupation",
                "type": "integer",
                "value": zonesOc.el
            }
            ]
        }
   ],
    "updateAction": "UPDATE"
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
    path: '/v1/updateContext',
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
  //  console.log("Updated context for the Elevator");
  });
});

req.on('error', function(e) {
  console.log('Problem with request in the Elevator');
});

req.write(payloadString);
req.end();
},2000);
};