//make connection
var socket = io.connect('https://foam-airboat.glitch.me/');

//query dom
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

//emit events
btn.addEventListener('click', function(e) {
  e.preventDefault();
  socket.emit('chat', {
    message: message.value,
    handle: handle.value
  });
});

message.addEventListener('keypress', function(){
  socket.emit('typing', handle.value);
})

//listen for events
socket.on('chat', function(data) {
  feedback.innerHTML = '';
  output.innerHTML += '<p><strong>' + data.handle + ':</strong> ' + data.message + '</p>';
  message.value = '';
});

socket.on('typing', function(data) {
   feedback.innerHTML = '<p>' + data + ' is typing a message...</p>';
});