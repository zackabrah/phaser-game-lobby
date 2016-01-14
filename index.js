// use express to initialize a function handler to be passed to a new node HTTP server
var express = require('express');
var http = require('http');
var app = express();
var server = http.Server(app);

// listen for get requests on the root directory and respond
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// listen on port 3000 for user connections
server.listen(3000, function () {
    console.log('listening on *:3000');
});