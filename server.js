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
    users.push(data);
    io.sockets.emit('newUser', data);
  });
  
  socket.on('nameChange', function(data){
    console.log(data.oldName + ' changed name to ' + data.newName);
    var toChange = users.findIndex(function(user) { return user === data.oldName });
    users[toChange] = data.newName;
    io.sockets.emit('nameChange', data);
  });
  
  socket.on('userLeaves', function(data){
    console.log(data + ' has left');
    var toRemove = users.findIndex(function(user) { return user === data });
    if (toRemove >= 0) {
      users.splice(toRemove, 1);
      socket.broadcast.emit('userLeaves', data);
    }
  });
  
});

//current users - populate as people connect
var users = [];