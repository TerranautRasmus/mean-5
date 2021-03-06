angular.module('chat', [])

    .factory('socket', function ($rootScope) {
        // See: http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
        // for further details about this wrapper
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    })

    .controller('mainController', ['socket', '$window', function (socket, $window) {
        var self = this;


        self.messages = [];
        self.onlineUsers = [];
        self.haveChosenUsername = false;
        self.showOnlineUsers = false;

        var thisUser;


        //Returning user
        if ($window.localStorage.username) {
            thisUser = $window.localStorage.username;
            self.haveChosenUsername = true;
            self.showOnlineUsers = true;
            socket.emit('message', thisUser + " has returned!");
        }


        //New user
        self.newuser = function () {
            $window.localStorage.username = self.usernameInput;
            socket.emit('newuser', self.usernameInput);
            thisUser = self.usernameInput;
            self.showOnlineUsers = true;
            socket.emit('message', self.usernameInput + " Entered the chat!");
            self.haveChosenUsername = true;
        };

        socket.on('userlist', function (users) {
            self.onlineUsers = users;
            console.log("USERLIST: " + self.onlineUsers);
        });

        socket.on('newuser', function (usernameInput) {
            console.log("user received and pushed!");
        });

        //Date-time
        self.sendMessage = function () {
            var currentdate = new Date();
            var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth() + 1) + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

            if (thisUser == undefined) {
                thisUser = "Anonymous"
            }

            //Final message to send
            var messageWithDateUser = datetime + ': ' + thisUser + ' - ' + self.messageInput;

            socket.emit('message', messageWithDateUser);
            //Clears the chatfield
            self.messageInput = '';
        };

        //Sends message
        socket.on('message', function (message) {
            self.messages.push({
                body: message
            });
        });
    }]);
