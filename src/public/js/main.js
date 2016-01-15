(function () {
    var socket = io();

    // handle when the create new game button is pressed
    $('#game-container').on('click', '#btn-host-game', function() {
        // create a new socket.io room and assign socket
        socket.emit('host', socket.id, function(roomID) {

            // client has created and joined new room

        });
    });

    $('#game-container').on('click', '#btn-join-game', function() {
        var roomID = $(this).data('button');
        socket.emit('join', roomID, function(data) {


        });
    });

    socket.on('debugMessage', function(msg) {
        $('#debug').append('<p>' + msg + '</p>');
    });

    socket.on('update', function(rooms) {

        var room, key;
        $('.room-list-item').remove();
        for (key in rooms) {
            if (rooms.hasOwnProperty(key)) {
                room = rooms[key];
                addSingleRoomToList(room);
            }
        }
    });

    function addSingleRoomToList(room) {
        $('#game-list-table').append(
            '<tr class="room-list-item">'
            + '<td>' + room.id + '</td>'
            + '<td>' + room.clients.length + '/10</td>'
            + '<td><button id=btn-join-game data-button=' + room.id + '>Join Room</button></td>'
        );
    }
})();