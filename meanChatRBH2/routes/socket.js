var ChatLog = require('../model/chatLog');
var onlineUsers = [];
var messages = [];

module.exports = function (socket) {


    //    socket.on('message', function (message) {
    //    broadcast('message', message);
    //    messages.push(message);
    //    broadcast('allMessages', messages);
    //    broadcast('onlineUsers', onlineUsers);
    //});

    socket.on('message', function (message) {
        broadcast('message', message);
        messages.push(message);
        broadcast('allMessages', messages);
        broadcast('onlineUsers', onlineUsers);


        //Log chatmessages to the database
        var newMessage = new ChatLog({
            message: message
        });
        newMessage.save(function (err) {
            if (err) {
                throw(err);
                console.log(err)
            } else {
                console.log("Message logged in db!")
            }
        });
    });

    socket.on('newuser', function (user) {
        broadcast('newuser', user);
        onlineUsers.push(user);
        //broadcast('message', datetime + " - " + user + " logged on!");
        broadcast('onlineUsers', onlineUsers);
        //console.log("Users online: " + onlineUsers)
    });



    function broadcast(type, payload) {
        //Sends message to other users browsers.
        socket.broadcast.emit(type, payload);
        //Sends your own.
        socket.emit(type, payload);
    }


};