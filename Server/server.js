var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function() {
	console.log('Servidor corriendo en http://192.168.208.41:3000');
});

io.on('connection', function(socket) {
	console.log('Un cliente se ha conectado con id: ' + socket.id);
  socket.emit('login', { idSocket: socket.id, message: 'Welcome' });
  socket.on('channelRequest', function(channel) { // data se supone que es el nombre del channel
  	console.log('request channel recieved -->', channel);
    socket.emit('channelRequest', channel);
    socket.on(channel, function(dataRecievedFromChannel){
      console.log('message recieved in channel '+ channel + ': '+ dataRecievedFromChannel);
      socket.broadcast.emit(channel, dataRecievedFromChannel);
    });
  });
});
