var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var prettyjson = require('prettyjson');
var fs = require("fs");
var http = require('http');
var app = express();
var queryContext = require('./context_operations/queryContext');
var subscriptions = require('./context_operations/subscription');

// Set more sockets to http connections
http.globalAgent.maxSockets = 40;

//IdM requirements 
var OAuth2 = require('./oauth2').OAuth2;
var config = require('./config');

//socket array for multiple data streams
var sockets = [];

// ejs view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "skjghskdjfhbqigohqdiouk"
}));

/* ContextBroker subscriptions variables  */
var subID; 
var subIds = [];

// Var to store token for the access to admin room
token_admin_rooms = undefined;

// IdM config data from config.js file
var client_id = config.client_id;
var client_secret = config.client_secret;
var idmURL = config.idmURL;
var callbackURL = config.callbackURL;

/*IdM User Data variables*/

var userName;
var userRole;

// Creates oauth library object with the IdM config data
var oa = new OAuth2(client_id,
                    client_secret,
                    idmURL,
                    '/oauth2/authorize',
                    '/oauth2/token',
                    callbackURL);


/* Context information responses for each Room on data change  */ 

// Update Chocolate Room
app.post("/contextResponseCR", function(req, resp){
  var theJson = req.body.data[0]
  subID = req.body.subscriptionId;
  console.log("chocolate: " + subID);
  var exist = subIds.indexOf(subID);
      if(exist == -1){
        subIds.push(subID);
        console.log("SubId of Chocolate Room stored");
      }

  for(s in sockets){
      sockets[s].emit('updateCR', theJson);
  }
});

// Update Inventing Room
app.post("/contextResponseIR", function(req, resp){
  var theJson = req.body.data[0]
  subID = req.body.subscriptionId;
  console.log("invent " + subID);
  var exist = subIds.indexOf(subID);
      if(exist == -1){
        subIds.push(subID);
        console.log("SubId of Inventing Room stored");
      }

  for(s in sockets){
      sockets[s].emit('updateIR', theJson);
  }
});

// Update Television Room
app.post("/contextResponseTR", function(req, resp){
  var theJson = req.body.data[0]
  subID = req.body.subscriptionId;
  console.log("tv room " + subID);
  var exist = subIds.indexOf(subID);
      if(exist == -1){
        subIds.push(subID);
        console.log("SubId of Television Room stored");
      }

  for(s in sockets){
      sockets[s].emit('updateTR', theJson);
  }
});

// Update Map Room
app.post("/contextResponseAR", function(req, resp){
  var theJson = req.body.data[0]
  subID = req.body.subscriptionId;
  console.log("Occupation " + subID);
  var exist = subIds.indexOf(subID);
      if(exist == -1){
        subIds.push(subID);
        console.log("SubId of Occupation stored");
      }

  for(s in sockets){
      sockets[s].emit('updateAR', theJson);
  }
});

// Update Admin Room  
app.post("/contextResponseARA", function(req, resp){
  var theJson = req.body.data[0]
  subID = req.body.subscriptionId;
  console.log("Admin Room " + subID);
  var exist = subIds.indexOf(subID);
      if(exist == -1){
        subIds.push(subID);
        console.log("SubId of Admin Room stored");
      }

  for(s in sockets){
      sockets[s].emit('updateARA', theJson);
  }
});

// //Big hall 
// app.post("/contextResponseHall", function(req, resp){
//   var theJson = req.body.contextResponses[0].contextElement
//   subID = req.body.subscriptionId;
//   console.log("hall " + subID);
//   var exist = subIds.indexOf(subID);
//       if(exist == -1){
//         subIds.push(subID);
//         console.log("SubId of Big Hall stored");
//       }

//   for(s in sockets){
//       sockets[s].emit('updateHall', theJson);
//   }
// });

// //Willy Wonka's office
// app.post("/contextResponseOffice", function(req, resp){
//   var theJson = req.body.contextResponses[0].contextElement
//   subID = req.body.subscriptionId;
//   console.log("office " + subID);
//   var exist = subIds.indexOf(subID);
//       if(exist == -1){
//         subIds.push(subID);
//         console.log("SubId of Office stored");
//       }

//   for(s in sockets){
//       sockets[s].emit('updateOffice', theJson);
//   }
// });

// //Elevator
// app.post("/contextResponseElevator", function(req, resp){
//   var theJson = req.body.contextResponses[0].contextElement
//   subID = req.body.subscriptionId;
//   console.log("Elevator " + subID);
//   var exist = subIds.indexOf(subID);
//       if(exist == -1){
//         subIds.push(subID);
//         console.log("SubId of Elevator stored");
//       }

//   for(s in sockets){
//       sockets[s].emit('updateElevator', theJson);
//   }
// });

/* Page router and Pep-Proxy connection for permission handling */

// Front page    
app.get('/', function (req, res) { 
  if(subIds.length > 0){
    for(id in subIds){
      subscriptions.unsubscribeContext(req.session.access_token, subIds[id]); 
    }
     subIds = [];
    }
    if(!req.session.access_token) {
      res.render('login');
    } else {
      res.redirect("/index");
      console.log(req.session.access_token);
    }
});

// Redirection Uri
app.get('/login', function(req, res){
  // Using the access code goes again to the IDM to obtain the access_token
  oa.getOAuthAccessToken(req.query.code, function (e, results){
    // Stores the access_token in a session cookie
    req.session.access_token = results.access_token;
    console.log(req.session.access_token)
    res.redirect('/admin-menu');
  });
});

// To get path to oauth server (IdM)
app.get('/auth', function(req, res){
  var path = oa.getAuthorizeUrl();
  res.redirect(path);
});

// Log Out form app
app.get('/logout', function(req, res){
  if (subIds.length > 0) {
    for (id in subIds) {
       subscriptions.unsubscribeContext(req.session.access_token, subIds[id]);
    }
    subIds = [];
  }
  token_admin_rooms = undefined;
  req.session.access_token = undefined;  
  res.redirect('/');
});

// To render admin menu
app.get('/admin-menu', function(req, res){
  if(subIds.length > 0){
      for(id in subIds){
        subscriptions.unsubscribeContext(req.session.access_token, subIds[id]);
      }
    subIds = [];
  }
  res.render('adminMenu');
});

// To render admin map
app.get('/admin-map', function(req, res){
	subscribeData = subscriptions.subscribeAdminMapContext(req.session.access_token);
  var completed_requests = 1;
  for ( i= 1; i < subscribeData.length; i++) {
    	var req = http.request(subscribeData[0], function(response) {
      		response.setEncoding('utf-8');
      		console.log('STATUS: ' + response.statusCode);
          completed_requests++;
      		if((response.statusCode == 200) && (completed_requests == 6)){
        		console.log("Subscription accepted")
            res.render('roomMap');
     		  } else if((response.statusCode == 401) && (completed_requests == (subscribeData.length - 1))) {
       			  res.redirect('/notAuthorized');
      		}
    	});

    	req.on('error', function(e) {
    	  console.log('Problem with the Occupations subscription');
    	});

    	req.write(subscribeData[i]);
    	req.end();
  }
 });  

// To render admin rooms
app.get('/admin-rooms', function(req, res){
	token_admin_rooms = req.session.access_token;
  subscribeData = subscriptions.subscribeAdminRoomContext(req.session.access_token);
	var req = http.request(subscribeData[0], function(response) {
  		response.setEncoding('utf-8');
  		console.log('STATUS: ' + response.statusCode);
  		if(response.statusCode == 200){
    		console.log("Subscription accepted")
    		res.render('roomsAdmin');
 		} else if(response.statusCode == 401) {
   			res.redirect('/notAuthorized');
  		}
	});

	req.on('error', function(e) {
	  console.log('Problem with the Chocolate Room subscription');
	});

	req.write(subscribeData[1]);
	req.end();
});

// To render television room
app.get('/televisionroom', function(req, res){
	subscribeData = subscriptions.subscribeTelevisionContext(req.session.access_token);
	var req = http.request(subscribeData[1], function(response) {
  		response.setEncoding('utf-8');
  		console.log('STATUS: ' + response.statusCode);
  		if(response.statusCode == 200){
    		console.log("Subscription accepted")
      		res.render('televisionRoom');
 		} else if(response.statusCode == 401) {
   			res.redirect('/notAuthorized');
  		}
	});

	req.on('error', function(e) {
	  console.log('Problem with the Television Room subscription');
	});

	req.write(subscribeData[0]);
	req.end();
});

// To render inventing room
app.get('/inventingroom', function(req, res){
  	subscribeData = subscriptions.subscribeInventingContext(req.session.access_token);
	var req = http.request(subscribeData[1], function(response) {
  		response.setEncoding('utf-8');
  		console.log('STATUS: ' + response.statusCode);
  		if(response.statusCode == 200){
    		console.log("Subscription accepted")
      		res.render('inventingRoom');
 		} else if(response.statusCode == 401) {
   			res.redirect('/notAuthorized');
  		}
	});

	req.on('error', function(e) {
	  console.log('Problem with the Inventing Room subscription');
	});

	req.write(subscribeData[0]);
	req.end();
});

// To render chocolate room
app.get('/chocolateroom', function(req, res){
	subscribeData = subscriptions.subscribeChocolateContext(req.session.access_token);
	var req = http.request(subscribeData[1], function(response) {
  		response.setEncoding('utf-8');
  		console.log('STATUS: ' + response.statusCode);
  		if(response.statusCode == 200){
    		console.log("Subscription accepted")
      		res.render('chocolateRoom');
 		} else if(response.statusCode == 401) {
   			res.redirect('/notAuthorized');
  		}
	});

	req.on('error', function(e) {
	  console.log('Problem with the Chocolate Room subscription');
	});

	req.write(subscribeData[0]);
	req.end();
 });

// To render unauthorized
app.get('/notAuthorized', function(req, res){
	if (subIds.length > 0){
        for (id in subIds) {
          subscriptions.unsubscribeContext(req.session.access_token, subIds[id]);
        }
        subIds = [];
      }
  	res.render('notauthorized');
});

// To handle back button
app.get('/back', function(req, res){
  console.log('BACK');
  res.redirect('/admin-menu');
});

// Start server
var server = app.listen(1028, function () {
  console.log('App listening at 1028');
});

var io = require('socket.io').listen(server);

// Sockets
io.on("connection", function(socket){
  sockets.push(socket);
  socket.on('subchocolate', function(data){
  	// Unsubscribe from other room
    if(subIds.length > 0){
      for(id in subIds){
          subscriptions.unsubscribeContext(token_admin_rooms, subIds[id]);      
      }
      subIds = [];
    }
    // Subscribe Chocolate Room
    subscribeData = subscriptions.subscribeChocolateContext(token_admin_rooms);
	var req = http.request(subscribeData[1], function(response) {
  		response.setEncoding('utf-8');
  		console.log('STATUS: ' + response.statusCode);
  		if(response.statusCode == 200){
    		console.log("Subscription accepted")
 		} else if(response.statusCode == 401) {
   			console.log("Not Authorized");
  		}
	});

	req.on('error', function(e) {
	  console.log('Problem with the Chocolate Room subscription');
	});

	req.write(subscribeData[0]);
	req.end();
  }); 

  socket.on('subinventing', function(data){
  	// Unsubscribe from other room
    if(subIds.length > 0){
      for(id in subIds){
          subscriptions.unsubscribeContext(token_admin_rooms, subIds[id]);          
      }
      subIds = [];
    }
    // Subscribe Inventing Room
    subscribeData = subscriptions.subscribeInventingContext(token_admin_rooms);
	var req = http.request(subscribeData[1], function(response) {
  		response.setEncoding('utf-8');
  		console.log('STATUS: ' + response.statusCode);
  		if(response.statusCode == 200){
    		console.log("Subscription accepted")
 		} else if(response.statusCode == 401) {
   			console.log("Not Authorized");
  		}
	});

	req.on('error', function(e) {
	  console.log('Problem with the Inventing Room subscription');
	});

	req.write(subscribeData[0]);
	req.end();  
  });

  socket.on('subtelevision', function(data){
  	// Unsubscribe from other room
    if(subIds.length > 0){
      for(id in subIds){
          subscriptions.unsubscribeContext(token_admin_rooms, subIds[id]);              
      }
      subIds = [];
    }
    // Subscribe Television Room
    subscribeData = subscriptions.subscribeTelevisionContext(token_admin_rooms);
	var req = http.request(subscribeData[1], function(response) {
  		response.setEncoding('utf-8');
  		console.log('STATUS: ' + response.statusCode);
  		if(response.statusCode == 200){
    		console.log("Subscription accepted");
 		} else if(response.statusCode == 401) {
   			console.log("Not Authorized");
  		}
	});

	req.on('error', function(e) {
	  console.log('Problem with the Television Room subscription');
	});

	req.write(subscribeData[0]);
	req.end();  
  });
});

module.exports = app;
