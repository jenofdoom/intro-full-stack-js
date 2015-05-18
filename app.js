var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Hashids = require("hashids"),
    hashPadding = 10000,
    hashids = new Hashids("my random text goes here change this if you like");

app.use(express.static('public'));

app.get('*', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

// data structure for rooms and room owners
// this could just keep growing
var rooms = [];

io.on('connection', function(socket){
  console.log('a user connected, ' + io.engine.clientsCount + ' total user(s)');

  socket.on('disconnect', function(){
    console.log('a user disconnected, ' + io.engine.clientsCount + ' total user(s)');
  });

  socket.on('new room', function(){
    var id = rooms.length;
    var hash = hashids.encode(id + hashPadding);
    var newRoom = {
      "id": id,
      "hash": hash,
      "owner": socket.id,
      "active": true,
      "question": null,
      "answers": null
    };

    rooms.push(newRoom);

    // subscribe to the room
    socket.join(hash);

    // only for the particular user that caused the event
    io.to(socket.id).emit('join room', newRoom, true);
  });

  socket.on('join room', function(hash){
    var id = hashids.decode(hash) - hashPadding;
    var result = rooms[id];
    var isOwner = false;

    if (result && (result.owner === socket.id)) {
      isOwner = true;
    }

    // subscribe to the room
    socket.join(hash);

    // only for the particular user that caused the event
    io.to(socket.id).emit('join room', result, isOwner);
  });

  socket.on('set question', function(data, hash){
    var id = hashids.decode(hash) - hashPadding;
    var room = rooms[id];

    if (room && (room.owner === socket.id)) {
      room.question = data.question;
      room.answers = data.answers;

      io.to(hash).emit('set question', room.hash, room.question, room.answers);
    }
  });

  socket.on('vote', function(answer, hash) {
    var id = hashids.decode(hash) - hashPadding;
    var room = rooms[id];

    if (room && (room.answers.hasOwnProperty(answer))) {
      room.answers[answer] = room.answers[answer] + 1;
      io.to(hash).emit('vote', room);
    }
  });
});
