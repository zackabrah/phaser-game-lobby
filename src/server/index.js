// node module includes
var uuid = require('node-uuid');

// include our custom server configuration
var Server = require('./server.js');
var Room = require('./room.js');

// local variables
var rooms = {};
var clients = {};

var server = new Server();

server.on('connection', function (client) {
    clients[client.id] = {id: client.id, room: null, isHost: false};
    client.emit('update', rooms);
    server.sockets.emit('debugMessage', '<p>' + client.id + ' has joined the server');


    client.on('disconnect', function() {

        if (clients[client.id].isHost) {
            var room = findRoomByHostID(client.id, rooms);
            delete rooms[room.id];
            server.sockets.emit('update', rooms);
        }

        server.sockets.emit('debugMessage', '<p>' + client.id + ' has disconnected from the server');
        delete clients[client.id];

    });

    client.on('join', function(roomID, callback) {
        // join existing room
        if (connectClientToRoom(roomID, client.id, false)) {
            callback(roomID);
        }
    });

    client.on('host', function(data, callback) {
        // create new room ID on host
        var newRoomID = uuid.v4();
        if (connectClientToRoom(newRoomID, client.id, true)) {
            callback(newRoomID);
        }
    });

    function connectClientToRoom(roomID, clientID, isHost) {
        // if the client is already a host, or already connected to a room
        if (clients[clientID].isHost || clients[clientID].room) {
            return false;
        }

        client.join(roomID, function(err) {
            if (!err) {

                clients[client.id].isHost = isHost;
                clients[client.id].room = roomID;
                //rooms[roomID] = new Room(roomID, clientID, isHost);

                if (isHost) {
                    rooms[roomID] = new Room(roomID, clientID);
                    server.sockets.emit('debugMessage', '<p>' + clientID + ' has created room: ' + roomID);
                    server.sockets.emit('debugMessage', '<p>' + JSON.stringify(rooms));

                } else {
                    rooms[roomID].addClient(clientID);
                    server.sockets.emit('debugMessage', '<p>' + clientID + ' has joined room: ' + roomID);
                }

                server.sockets.emit('update', rooms);

            } else {
                // handle error message

            }
        });


        return true;
    }

    function findRoomByHostID(hostID, rooms) {
        var key, room;
        for (key in rooms) {
            if (rooms.hasOwnProperty(key)) {
                room = rooms[key];
                if (room.hostID === hostID) {
                    return room;
                }
            }
        }
        return null;
    }
});

