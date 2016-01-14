// use express to initialize a function handler to be passed to a new node HTTP server
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/src'));

// listen for get requests on the root directory and respond
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

// listen on port 3000 for user connections
http.listen(3000, function () {
    console.log('listening on *:3000');
});