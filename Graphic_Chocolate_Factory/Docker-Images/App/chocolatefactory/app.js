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
var updates = require('./context_operations/update');
var queries = require('./context_operations/query');

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
token_rooms = undefined;

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

//Chocolate Room
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

//Inventing Room
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

//Television Room
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

//Occupation on all rooms
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

app.post("/contextResponseARA", function(req, resp){
  var theJson = req.body.data[0]
  subID = req.body.subscriptionId;
  console.log("Occupation " + subID);
  var exist = subIds.indexOf(subID);
      if(exist == -1){
        subIds.push(subID);
        console.log("SubId of Occupation stored");
      }

  for(s in sockets){
      sockets[s].emit('updateARA', theJson);
  }
});


/* Page router and Pep-Proxy connection for permission handling */
    
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


app.get('/login', function(req, res){
  // Using the access code goes again to the IDM to obtain the access_token
  oa.getOAuthAccessToken(req.query.code, function (e, results){
    // Stores the access_token in a session cookie
    req.session.access_token = results.access_token;
    console.log(req.session.access_token)
    res.redirect('/admin-menu');
  });
});

app.get('/auth', function(req, res){
  var path = oa.getAuthorizeUrl();
  res.redirect(path);
});

app.get('/logout', function(req, res){
  if (subIds.length > 0) {
    for (id in subIds) {
       subscriptions.unsubscribeContext(req.session.access_token, subIds[id]);
    }
    subIds = [];
  }
  token_rooms = undefined;
  req.session.access_token = undefined;  
  res.redirect('/');
});

app.get('/admin-menu', function(req, res){
  if(subIds.length > 0){
      for(id in subIds){
        subscriptions.unsubscribeContext(req.session.access_token, subIds[id]);
      }
    subIds = [];
  }
  res.render('adminMenu');
});

app.get('/admin-map', function(req, res){
	subscribeData = subscriptions.subscribeAdminMapContext(req.session.access_token);
	var req = http.request(subscribeData[0], function(response) {
  		response.setEncoding('utf-8');
  		console.log('STATUS: ' + response.statusCode);
  		if(response.statusCode == 200) {
    		console.log("Subscription accepted")
        res.render('roomMap');
 		  } else if(response.statusCode == 401) {
   			  res.redirect('/notAuthorized');
  		}
	});

	req.on('error', function(e) {
	  console.log('Problem with the Occupations subscription');
	});

	req.write(subscribeData[1]);
	req.end();
 });  

app.get('/admin-rooms', function(req, res){
	token_rooms = req.session.access_token;
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
	  console.log('Problem with the Admin Room subscription');
	});

	req.write(subscribeData[1]);
	req.end();
});

app.get('/televisionroom', function(req, res){
  token_rooms = req.session.access_token;
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

app.get('/chocolateroom', function(req, res){
  token_rooms = req.session.access_token;
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

app.get('/squirrellocation', function(req, res){
  queryData = queries.queryLocation(req.session.access_token);
  var req = http.request(queryData[1], function(response) {
      response.setEncoding('utf-8');
      console.log('STATUS: ' + response.statusCode);
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        if(response.statusCode == 200){
          console.log("Query accepted")
          res.render('locationSquirrel', { data: chunk });
          } else if(response.statusCode == 401) {
            res.redirect('/notAuthorized');
          }
      });
  });

  req.on('error', function(e) {
    console.log('Problem with the Location subscription');
  });

  req.write(queryData[0]);
  req.end();
 });


app.get('/notAuthorized', function(req, res){
	if (subIds.length > 0){
        for (id in subIds) {
          subscriptions.unsubscribeContext(req.session.access_token, subIds[id]);
        }
        subIds = [];
      }
  	res.render('notauthorized');
});

app.get('/back', function(req, res){
  console.log('BACK');
  res.redirect('/admin-menu');
});


var server = app.listen(1028, function () {
  console.log('App listening at 1028');
});

var io = require('socket.io').listen(server);

io.on("connection", function(socket){
  sockets.push(socket);
  socket.on('subriver', function(data){
    // Update Chocolate Room
    console.log('subriver')
    updateData = updates.updateRiverContext(token_rooms,  data.riverValue);
    var req = http.request(updateData[1], function(response) {
      response.setEncoding('utf-8');
      console.log('STATUS: ' + response.statusCode);
      for(s in sockets){
          sockets[s].emit('riverChoc', {status: response.statusCode, incr: data.incr});
      }
    });

    req.on('error', function(e) {
      console.log('Problem with the Chocolate Room update');
    });

    req.write(updateData[0]);
    req.end();  
  });

  socket.on('subwaterfall', function(data){
    // Update Chocolate Room
    console.log('subwaterfall')
    updateData = updates.updateWaterfallContext(token_rooms, data.waterValue);
    var req = http.request(updateData[1], function(response) {
      response.setEncoding('utf-8');
      console.log('STATUS: ' + response.statusCode);
      for(s in sockets){
          sockets[s].emit('waterCho', {status: response.statusCode, incr: data.incr});
      }
    });

    req.on('error', function(e) {
      console.log('Problem with the Chocolate Room update');
    });

    req.write(updateData[0]);
    req.end();  
  });

  socket.on('subtelevision', function(data){
    // Update Television Room
    updateData = updates.updateTelevisionContext(token_rooms, data.tvName, data.switchON, data.powerValue);
    var req = http.request(updateData[1], function(response) {
      response.setEncoding('utf-8');
      console.log('STATUS: ' + response.statusCode);
      for(s in sockets){
          sockets[s].emit('switch', {status: response.statusCode, index: data.index});
      }
    });

    req.on('error', function(e) {
      console.log('Problem with the Television Room update');
    });

    req.write(updateData[0]);
    req.end();  
  });
});

module.exports = app;
