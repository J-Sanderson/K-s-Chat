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
  })
  
});