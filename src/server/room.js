function Room(id, clientID) {
    this.id = id;
    this.hostID = clientID;
    this.clients = [];
    this.addClient(clientID);

};

Room.prototype.addClient = function(clientID) {
    this.clients.push(clientID);
};

module.exports = Room;