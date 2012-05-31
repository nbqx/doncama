var express = require('express')
var app = express.createServer();
var io = require('socket.io').listen(app);

app.configure(function(){
  app.use(express.static(__dirname+'/public'));
});
app.listen(12345);

app.get('/', function(req,res){
  res.sendfile(__dirname + '/public/index.html');
});

var ids = [];
var donc = undefined;

io.sockets.on('connection', function(socket){
  var sid = socket.id;
  ids.push(sid);
  socket.emit('hello', sid);

  if(donc===undefined){
    donc = ids[0];
  }

  console.log('donc: '+donc);

  if(sid==donc){
    io.sockets.socket(donc).emit('master');
  }
  
  socket.on('don', function(){
    socket.broadcast.send();
  });

  socket.on('disconnect', function(){
    ids = ids.filter(function(i){return i!==sid});
    if(ids.length!==0){
      donc = ids[0];
      io.sockets.socket(donc).emit('master');
    }else{
      donc = undefined;
    }
    console.log('donc: '+donc);
  });

});