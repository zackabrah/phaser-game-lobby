(function () {
    var socket = io();

    var rooms = [];
    // handle when the create new game button is pressed
    $('#btn-host-game').on('click', function() {
        // create a new socket.io room and assign socket
        socket.emit('host-game', socket.id, function(roomData) {

            // push the new room meta data to the array
            console.log(roomData + ' has been created');
        });
    });

    socket.on('update-game-list', function(roomData) {
        console.log(roomData);
        for (var i = 0; i < roomData.length; i++) {
            $('#game-list-table').append(
                '<tr>' +
                '<td>' +  roomData[i].roomID + '</td>' +
                '<td>' + roomData[i].playerCount + '/10' + '</td>' +
                '<td><button>Join Game</button></td>' +
                '</tr>'
            );
        }
    });


})();