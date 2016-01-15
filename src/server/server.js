// use express to initialize a function handler to be passed to a new node HTTP server
var Server = function() {
    var express = require('express');
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    // express static file middleware
    app.use(express.static(__dirname + '/../public'));

    // listen for get requests on the root directory and respond
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/../public/index.html');
    });

    // listen on port 3000 for user connections
    http.listen(3000, function () {
        console.log('listening on *:3000');
    });

    // all we need is the io handle for client sever communication - encapsulate the rest
    return io;
};

module.exports = Server;


