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
    clients[client.id] = {id: client.id, room: null, isHost: false, color: '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6)};
    client.emit('update', rooms);
    broadcastDebugMsg(client.id + ' has joined the server');


    client.on('disconnect', function() {

        if (clients[client.id].isHost) {
            var room = findRoomByID(client.id, rooms);
            delete rooms[room.id];
            server.sockets.emit('update', rooms);
        }

        broadcastDebugMsg(client.id + ' has disconnected from the server');
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

    client.on('chatMessage', function(msg) {
        // find out which room the client is in
        var room = findRoomByID(client.id, rooms);

        server.sockets.in(room.id).emit('addChatMessage', msg, client.id, clients[client.id].color);


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
                    broadcastDebugMsg(clientID + ' has created room: ' + roomID);
                } else {
                    rooms[roomID].addClient(clientID);
                    broadcastDebugMsg(client.id + ' has joined room: ' + roomID);

                }

                server.sockets.emit('update', rooms);

            } else {
                // handle error message

            }
        });


        return true;
    }

    function broadcastDebugMsg(msg) {
        server.sockets.emit('debugMessage', msg);
    }

    function findRoomByID(clientID, rooms) {
        var key, room;
        for (key in rooms) {
            if (rooms.hasOwnProperty(key)) {
                room = rooms[key];
                //if (room.hostID === hostID) {
                //    return room;
                //}
                for (var i = 0; i < room.clients.length; i++) {
                    if (room.clients[i] === clientID) {
                        return room;
                    }
                }
            }
        }
        return null;
    }
});

