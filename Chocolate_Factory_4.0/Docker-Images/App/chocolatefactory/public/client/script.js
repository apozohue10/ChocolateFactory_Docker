var socket = io();
var theData = {};


socket.on('update', function(data){
  theData = data;
  //console.log(message);

});
/*
var interval = setInterval(function(){
  socket.emit('getUpdate');

},1000);
/*