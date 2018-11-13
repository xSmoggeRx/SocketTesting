var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function() {
	console.log('Servidor corriendo en http://localhost:3000');
});

io.on('connection', function(socket) {
	console.log('Un cliente se ha conectado con id: ' + socket.id);
  socket.emit('login', { idSocket: socket.id, message: 'Welcome' });
  socket.on(socket.id, function(channel) { // data se supone que es el nombre del channel
  	console.log('request channel recieved -->', channel);
    socket.emit(socket.id, channel);
    socket.on(channel, function(dataRecievedFromChannel){
      console.log('message recieved in channel '+ channel + ': '+ dataRecievedFromChannel);
      socket.emit(channel, dataRecievedFromChannel);
    });
  });
});
