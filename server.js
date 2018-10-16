// init project
var express = require('express');
var socket = require('socket.io');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

//socket setup
var io = socket(listener);

io.on('connection', function(socket) {
  console.log("made socket connection on " + socket.id);
  
  socket.on('chat', function(data) {
    io.sockets.emit('chat', data);
  });
  
  socket.on('typing', function(data) {
    socket.broadcast.emit('typing', data);
  });
  
  socket.on('newUser', function(data) {
    console.log("new user " + data + " on " + socket.id);
    users.push({
      id: socket.id,
      handle: data
    });
    io.sockets.emit('newUser', data);
  });
  
  socket.on('nameChange', function(data){
    console.log(socket.id + ' changed name to ' + data);
    var toChange = users.findIndex(function(user) { return user.id === socket.id });
    var oldName = users[toChange].handle;
    users[toChange].handle = data;
    io.sockets.emit('nameChange', {oldName: oldName, newName: data});
  });
  
});

//current users - populate as people connect
var users = [];