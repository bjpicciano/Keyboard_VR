var express = require('express');
var Player = require('./Player');
var CodeGen = require('./CodeGenerator');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// Serve our clients files from the base directory
app.use(express.static("./"));

var CodeGenerator = new CodeGen();
var players = {};

io.on('connection', function (socket) {
    // socket.on('handshake', function (username) {
    //     var connectMessage = "'" + socket.id + "' has connected";
    //     console.log(connectMessage);
    //
    //     // Give my client my player
    //     socket.emit('createServerEntities', players);
    //     // Tell everyone else I'm here
    //     socket.broadcast.emit('createServerEntities', packPlayerToObject(socket.id));
    // });

    socket.on('handshake', function (isMobile) {
        if (!isMobile) {
            players[socket.id] = new Player(socket.id, CodeGenerator.getCode(socket.id));

            // Give my client my player
            socket.emit('handshake', isMobile, players[socket.id]);

            var connectMessage = "'" + socket.id + "' has connected with code: " + players[socket.id].code;
            console.log(connectMessage);

            // Give my client all other players
            socket.emit('createServerEntities', players);
            // Tell everyone else I'm here
            socket.broadcast.emit('createServerEntities', packPlayerToObject(socket.id));
        } else {
            socket.emit('handshake', isMobile);
        }
    });

    socket.on('check_code', function (code) {
        var id = CodeGenerator.validateCode(code);

        if (id) {
            socket.emit('createServerEntities', players);
            socket.emit('attachToDesktopPlayer', id);
        } else {
            socket.emit('handshake', true);
        }
    });

    socket.on('key_down', function (key, rotationY) {
        players[socket.id].keys[key] = true;
        players[socket.id].direction = rotationY * Math.PI/180;
    });

    socket.on('key_up', function (key) {
        players[socket.id].keys[key] = false;
    });

    socket.on('mouse_rotate', function (rotation) {
        players[socket.id].rotation = rotation;
    });

    socket.on('getOnlineUsers', function () {
        var users = [];
        Object.keys(players).forEach(function (id) {
            users.push(id);
        });

        socket.emit('getOnlineUsers', users)
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('removeServerEntities', packPlayerToObject(socket.id));

        var disconnectMessage = "'" + socket.id + "' has disconnected ";
        console.log(disconnectMessage);

        if (players[socket.id]) {
            var code = players[socket.id].code;
            if (code) delete CodeGenerator.codes[code];
            delete players[socket.id];
        }
        socket.disconnect();
    });
});

function packPlayerToObject (id) {
    var obj = {};
    obj[id] = players[id];
    return obj;
}

function tick() {
    var entitiesSyncData = [];


    // Call the tick function on each entity in players
    Object.keys(players).forEach(function (id) {
        var player = players[id];
        player.tick();

        if (Object.keys(player.syncData).length > 0) {
            entitiesSyncData.push(Object.assign({}, player.syncData));

            player.syncData = {};
        }
    });

    io.sockets.emit('entityUpdate', entitiesSyncData);
    entitiesSyncData = {};
}

var serverPort = process.env.PORT || 3000;

http.listen(serverPort, function () {
    console.log("Server is listening on port " + serverPort);
});

// Keep track of our times
var local_time = 0;
var _dt = new Date().getTime();
var _dte = new Date().getTime();
var interval = 30;
// Server loop
setInterval(function(){
    _dt = new Date().getTime() - _dte;
    _dte = new Date().getTime();
    local_time += _dt/1000.0;

    tick();
}, interval);