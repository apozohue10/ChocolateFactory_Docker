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
var updateContext = require('./context_operations/updateContext');
var queryContext = require('./context_operations/queryContext');
var subscriptions = require('./context_operations/subscription');

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

/* Context information updates from the virtual sensors */
updateContext.updateChocolateRoom();
updateContext.updateInventingRoom();
updateContext.updateTelevisionRoom();
updateContext.updateHall();
updateContext.updateOffice();
updateContext.updateElevator();

/* Context information responses for each Room on data change  */ 

//Chocolate Room
app.post("/contextResponseCR", function(req, resp){
  var theJson = req.body.contextResponses[0].contextElement
  subID = req.body.subscriptionId;
  console.log("SubIds: " + subID);
  console.log(subIds)
  var exist = subIds.indexOf(subID);
      if(exist == -1){
        subIds.push(subID);
        console.log("SubId of Chocolate Room stored");
      }

  for(s in sockets){
      sockets[s].emit('updateCR', theJson);
  }
});

//Inventing Room
app.post("/contextResponseIR", function(req, resp){
  var theJson = req.body.contextResponses[0].contextElement
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

//Television Room
app.post("/contextResponseTR", function(req, resp){
  var theJson = req.body.contextResponses[0].contextElement
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

//Big hall 
app.post("/contextResponseHall", function(req, resp){
  var theJson = req.body.contextResponses[0].contextElement
  subID = req.body.subscriptionId;
  console.log("hall " + subID);
  var exist = subIds.indexOf(subID);
      if(exist == -1){
        subIds.push(subID);
        console.log("SubId of Big Hall stored");
      }

  for(s in sockets){
      sockets[s].emit('updateHall', theJson);
  }
});

//Willy Wonka's office
app.post("/contextResponseOffice", function(req, resp){
  var theJson = req.body.contextResponses[0].contextElement
  subID = req.body.subscriptionId;
  console.log("office " + subID);
  var exist = subIds.indexOf(subID);
      if(exist == -1){
        subIds.push(subID);
        console.log("SubId of Office stored");
      }

  for(s in sockets){
      sockets[s].emit('updateOffice', theJson);
  }
});

//Elevator
app.post("/contextResponseElevator", function(req, resp){
  var theJson = req.body.contextResponses[0].contextElement
  subID = req.body.subscriptionId;
  console.log("Elevator " + subID);
  var exist = subIds.indexOf(subID);
      if(exist == -1){
        subIds.push(subID);
        console.log("SubId of Elevator stored");
      }

  for(s in sockets){
      sockets[s].emit('updateElevator', theJson);
  }
});

/* Page router and Pep-Proxy connection for permission handling */
    
app.get('/', function (req, res) { 
  if(subIds.length > 0){
    for(id in subIds){
      subscriptions.unsubscribeContext(subIds[id]); 
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

app.get('/index', function(req, res) {
  var url = config.idmURL + '/user/';
  oa.get(url, req.session.access_token, function (e, response) {
    var user = JSON.parse(response);
    console.log(user); 
    userName = user.displayName;
    userRole = user.roles[0].name;
   
    if (userRole == "Factory Owner") {
   	  res.redirect('/admin-menu');
    } else if(userRole == "Television Room Oompa Loompa") {
   	  res.redirect('/televisionroom')
    } else if(userRole == "Chocolate Room Oompa Loompa") {
   	  res.redirect('/chocolateroom')
    } else if(userRole == "Inventing Room Oompa Loompa") {
   	  res.redirect('/inventingroom');
    } else if(userRole == "Security Guard") {
      res.redirect('/admin-map');
    }
  });
});

app.get('/login', function(req, res){
  // Using the access code goes again to the IDM to obtain the access_token
  oa.getOAuthAccessToken(req.query.code, function (e, results){
    // Stores the access_token in a session cookie
    req.session.access_token = results.access_token;
    console.log(req.session.access_token)
    res.redirect('/index');
  });
});

app.get('/auth', function(req, res){
  var path = oa.getAuthorizeUrl();
  res.redirect(path);
});

app.get('/logout', function(req, res){
  req.session.access_token = undefined;  
  if (subIds.length > 0) {
    for (id in subIds) {
       subscriptions.unsubscribeContext(subIds[id]);
    }
    subIds = [];
	}
  res.redirect('/');
});

app.get('/admin-map', function(req, res){
	var headers = {
    'X-Auth-Token': req.session.access_token
  };

  var options = {
    host: 'localhost',
    port: '8070',
    path: '/admin-map',
    headers: headers
  };
  var req = http.request(options, function(response) {
  	response.setEncoding('utf-8');
 	  console.log('STATUS: ' + response.statusCode);
 	  if (response.statusCode == 200) {
  	 	if (subIds.length > 0){
        for (id in subIds) {
          subscriptions.unsubscribeContext(subIds[id]);
        }
        subIds = [];
      }
      subscriptions.subscribeChocolateContext();
      subscriptions.subscribeTelevisionContext();
      subscriptions.subscribeHallContext();
      subscriptions.subscribeOfficeContext();
      subscriptions.subscribeElevatorContext();
      subscriptions.subscribeInventingContext();
      res.render('roomMap');

  	} else if (response.statusCode == 401) {
    	res.redirect('/notAuthorized');
  	} 
	});
  req.end();
 });  

app.get('/admin-menu', function(req, res){
  var headers = {
    'X-Auth-Token': req.session.access_token
  };

  var options = {
    host: 'localhost',
    port: '8070',
    path: '/admin-menu',
    headers: headers
  };
  var req = http.request(options, function(response) {
	  response.setEncoding('utf-8');
	 	console.log('STATUS: ' + response.statusCode);
	 	if(response.statusCode == 200){
      if(subIds.length > 0){
        for(id in subIds){
          subscriptions.unsubscribeContext(subIds[id]);
        }
        subIds = [];
      }
	    res.render('adminMenu');
	  } else if(response.statusCode == 401) {
	    res.redirect('/notAuthorized');
	  } 
	});
  req.end();
});

app.get('/admin-rooms', function(req, res){
  var headers = {
    'X-Auth-Token': req.session.access_token
  };

  var options = {
    host: 'localhost',
    port: '8070',
    path: '/admin-rooms',
    headers: headers
  };

  var req = http.request(options, function(response) {
  	response.setEncoding('utf-8');
 	 	console.log('STATUS: ' + response.statusCode);
    	if(response.statusCode == 200){
    		if(subIds.length > 0){
         	for(id in subIds){
            subscriptions.unsubscribeContext(subIds[id]);            	
          }
          subIds = [];
        }
    		subscriptions.subscribeChocolateContext();
    		res.render('roomsAdmin');
  		} else if(response.statusCode == 401){
  			res.redirect('/notAuthorized');
 		 } 
	});
	req.end();  
});

app.get('/televisionroom', function(req, res){
	var headers = {
    'X-Auth-Token': req.session.access_token
  };
  var options = {
    host: 'localhost',
    port: '8070',
    path: '/televisionroom',
    headers: headers
  };
  var req = http.request(options, function(response) {
	  response.setEncoding('utf-8');
	 	console.log('STATUS: ' + response.statusCode);
	 	 	if(response.statusCode == 200){
        subscriptions.subscribeTelevisionContext();
	  	 	res.render('televisionRoom');
	  	} else if(response.statusCode == 401) {
	    	res.redirect('/notAuthorized');
	  	} 
	});
  req.end();
 });

app.get('/inventingroom', function(req, res){
  var headers = {
    'X-Auth-Token': req.session.access_token
  };
  var options = {
    host: 'localhost',
    port: '8070',
    path: '/inventingroom',
    headers: headers
  };
  var req = http.request(options, function(response) {
	  response.setEncoding('utf-8');
	 	console.log('STATUS: ' + response.statusCode);
	 	if(response.statusCode == 200){
      subscriptions.subscribeInventingContext();
	  	res.render('inventingRoom');
	  } else if(response.statusCode == 401) {
	    	res.redirect('/notAuthorized');
	  } 
	});
  req.end();
});

app.get('/chocolateroom', function(req, res){
	var headers = {
    'X-Auth-Token': req.session.access_token
  };
  var options = {
    host: 'localhost',
    port: '8070',
    path: '/chocolateroom',
    headers: headers
  };
  var req = http.request(options, function(response) {
	  //response.setEncoding('utf-8');
	 	console.log('STATUS: ' + response.statusCode);
	 	if(response.statusCode == 200){
      subscriptions.subscribeChocolateContext();
	  	res.render('chocolateRoom');
	  } else if(response.statusCode == 401) {
	    res.redirect('/notAuthorized');
	  } 
	});
  req.end();
 });

app.get('/notAuthorized', function(req, res){
	if (subIds.length > 0){
        for (id in subIds) {
          subscriptions.unsubscribeContext(subIds[id]);
        }
        subIds = [];
      }
  res.render('notauthorized');
});

app.get('/back', function(req, res){
	if(userRole == "Factory Owner"){
    res.redirect('/admin-menu');
  } else if(userRole == "Television Room Oompa Loompa") {
    res.redirect('/televisionroom')
  } else if(userRole == "Chocolate Room Oompa Loompa") {
    res.redirect('/chocolateroom')
  } else if(userRole == "Inventing Room Oompa Loompa") {
    res.redirect('/inventingroom');
  } else if(userRole == "Security Guard") {
      res.redirect('/admin-rooms');
  } else {
    res.redirect('/');
  }
});


var server = app.listen(1028, function () {
  console.log('App listening at 1028');
});

var io = require('socket.io').listen(server);

io.on("connection", function(socket){
  sockets.push(socket);
  socket.on('subchocolate', function(data){
    if(subIds.length > 0){
      for(id in subIds){
          subscriptions.unsubscribeContext(subIds[id]);      
      }
      subIds = [];
    }
    subscriptions.subscribeChocolateContext();
  }); 

  socket.on('subinventing', function(data){
    if(subIds.length > 0){
      for(id in subIds){
          subscriptions.unsubscribeContext(subIds[id]);          
      }
      subIds = [];
    }
    subscriptions.subscribeInventingContext();   
  });

  socket.on('subtelevision', function(data){
    if(subIds.length > 0){
      for(id in subIds){
          subscriptions.unsubscribeContext(subIds[id]);              
      }
      subIds = [];
    }
    subscriptions.subscribeTelevisionContext();   
  });
});

module.exports = app;
