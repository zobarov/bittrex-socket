// server.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server);

const https = require('https');


var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./private/security.properties');


var apikey=properties.get('main.readonly.api.key');
var apiSecret='xxx';
//var nonce=time();



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

        var marketUrl = 'https://bittrex.com/api/v1.1/public/getmarkets?apikey=' + apikey;

        https.get(marketUrl, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
              body += data;
            });
            res.on("end", () => {
              body = JSON.parse(body);

            var marketCount = 0;
            for (var m in body.result){
                var marketName = body.result[m].MarketName;
                marketCount++;
                console.log('MarketName ' + marketCount + ':' + marketName);
            };
            console.log('Total market amount:' + marketCount);
              
            });
          });
  });
});

//start our web server and socket.io server listening
server.listen(3000, function(){
  console.log('listening on *:3000');
}); 