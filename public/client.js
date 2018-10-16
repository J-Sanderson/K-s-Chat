//make connection
var socket = io.connect('https://foam-airboat.glitch.me/');

//query dom
var message = document.getElementById('message'),
    enter = document.getElementById('enter'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    whosOn = document.getElementById('whos-on');

//emit events
enter.addEventListener('click', function(e) {
  document.getElementById('entry').style.display = 'none';
  handle.value = document.getElementById('name').value;
  socket.emit('newUser', handle.value);
})

btn.addEventListener('click', function(e) {
  sendMessage(e);
});

message.addEventListener('keypress', function(e){
  if (e.key === 'Enter') {
    sendMessage(e);
  } else {
    socket.emit('typing', handle.value);
  }
});

handle.addEventListener('keypress', function(e){
  if(e.key === 'Enter') {
    socket.emit('nameChange', handle.value);
  }
});

function sendMessage(e) {
  e.preventDefault();
  if (message.value) {
    socket.emit('chat', {
      message: message.value,
      handle: handle.value
    });
  }
}

//listen for events
socket.on('chat', function(data) {
  feedback.innerHTML = '';
  output.innerHTML += '<p><strong>' + data.handle + ':</strong> ' + data.message + '</p>';
  message.value = '';
});

socket.on('typing', function(data) {
   feedback.innerHTML = '<p class="info">' + data + ' is typing a message...</p>';
});

socket.on('newUser', function(data) {
  output.innerHTML += '<p class="info">' + data + ' has entered</p>';
  whosOn.innerHTML += '<p class="info" id="' + data + '">' + data + '</p>';
});

socket.on('nameChange', function(data) {
  output.innerHTML += '<p class="info">' + data.oldName + ' is now ' + data.newName + '</p>';
  var toChange = document.getElementById(data.oldName);
  toChange.innerHTML = data.newName;
  toChange.id = data.newName;
});