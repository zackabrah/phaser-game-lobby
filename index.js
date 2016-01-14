// use express to initialize a function handler to be passed to a new node HTTP server
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var rooms = [];
var hosts = {};
var clients = {};

// create a unique random id for games
function createRoomId() {
    return (0|Math.random()*9e6).toString(36).substring(0,4);
}

// a helper function -> check if an element is within an array
function in_array(search, array) {
    return array.indexOf(search) >= 0;
}

// express static file middleware
app.use(express.static(__dirname + '/src'));

// listen for get requests on the root directory and respond
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    // add new socket id to the clients array
    clients[socket.id] = socket;

    // update server list for client
    socket.emit('update-game-list', rooms);

    socket.on('disconnect', function () {
        console.log('user disconnected');

        // remove the socket id from the clients array
        clients[socket.id] = 0;
    });

    socket.on('join-game', function(data, ack) {

    });

    socket.on('host-game', function(data, ack) {

        // this socket id is already a host
        if (hosts[socket.id]) {

            // TODO - handle error case
            return false;
        }

        var roomID = createRoomId();

        socket.join(roomID, function(err) {
            if (!err) {

                // this socket id is now a game host
                hosts[socket.id] = true;

                // create a room data meta object
                var roomData = {"roomID":roomID, "playerCount":1, "hostID": socket.id};

                // acknowledge the room has been successfully created
                ack(roomData);

                // emit the new room creation to all users
                io.emit('update-game-list', [roomData]);

                // store the room data on the server
                rooms.push(roomData);

            } else {
                log(err, 'e');
            }
        });
    });
});

// listen on port 3000 for user connections
http.listen(3000, function () {
    console.log('listening on *:3000');
});
