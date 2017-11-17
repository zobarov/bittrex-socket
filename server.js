// server.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server);

//keep track of how times clients have clicked the button
var clickCount = 0;

app.use(express.static(__dirname + '/public'));
//redirect / to our index.html file
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/users', function(req, res,next) {  
    res.sendFile(__dirname + '/public/users.html');
});

//when a client connects, do this
io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('clicked', function(data) {
        clickCount++;
        //send a message to ALL connected clients
        io.emit('buttonUpdate', clickCount);
  });
});

//start our web server and socket.io server listening
server.listen(3000, function(){
  console.log('listening on *:3000');
}); 