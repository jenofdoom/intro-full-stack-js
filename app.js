var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('*', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected, ' + io.engine.clientsCount + ' total user(s)');

  socket.on('disconnect', function(){
    console.log('a user disconnected, ' + io.engine.clientsCount + ' total user(s)');
  });
});
