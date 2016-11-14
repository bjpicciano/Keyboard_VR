// Here is where we connect to the server and set up our socket listeners
var socket = io.connect('');
setUpSocketListeners();
socket.emit('handshake', AFRAME.utils.isMobile());

/**
 * Declare our socket's listeners here.
 */
function setUpSocketListeners() {
    var self = this;

    // When the server sends us a handshake we send one back to acknowledge
    this.socket.on('handshake', function (player) {
        var a_entity = document.createElement(player.tag);

        a_entity.setAttribute("id", player.id);
        a_entity.setAttribute("position", player.position);
        a_entity.appendChild(createPlayerCamera());
        a_entity.setAttribute('wasd-movement', "");

        document.querySelector('a-scene').appendChild(a_entity);
    });

    this.socket.on('createServerEntities', function (entities) {
        Object.keys(entities).forEach(function (key) {
            var entity = entities[key];
            if (!document.getElementById(entity.id)) {
                var a_entity = document.createElement(entity.tag);
                a_entity.setAttribute("id", entity.id);
                a_entity.setAttribute("position", entity.position);

                document.querySelector('a-scene').appendChild(a_entity);
            }
        });
    });

    this.socket.on('removeServerEntities', function (entities) {
        Object.keys(entities).forEach(function (key) {
            var entity = entities[key];
            var node = document.getElementById(entity.id);
            if (node) {
                document.querySelector('a-scene').removeChild(node);
            }
        });
    });

    this.socket.on('entityUpdate', function (entitiesSyncData) {
        entitiesSyncData.forEach(function (entity) {
            // console.log(entity)
            var a_entity = document.getElementById(entity.id);

            if (a_entity && a_entity.object3D) {
                //replace with recursive algorithm for each property in entity
                a_entity.object3D.position.x = entity.position.x;
                a_entity.object3D.position.y = entity.position.y;
                a_entity.object3D.position.z = entity.position.z;
            }
        });
    });

    // Loops through the given list of users and displays them
    this.socket.on('getOnlineUsers', function (users) {
        var online = "";
        var count = 0;
        for (var idx in users) {
            count++;
            if (users.hasOwnProperty(idx)) {
                online += users[idx] + ", ";
            }
        }
        online = online.substring(0, online.length - 2);

        var usersMessage = count + " user(s) online: " + online;
        console.log(usersMessage);
    });

    this.socket.on('connect_error', function () {
        // var a_scene = document.querySelector('a-scene');
        //
        // console.log(a_scene.getChildren);
    });

    this.socket.on('connect', function () {
        console.log("connected to server")
    });
}

function getPlayer () {
    return document.getElementById(socket.id);
}

function createPlayerCamera() {
    var a_camera = document.createElement("a-camera");
    a_camera.setAttribute("id", "camera");
    a_camera.setAttribute("wasd-controls-enabled", "false");

    var a_cursor = document.createElement("a-cursor");
    a_cursor.setAttribute("id", "cursor");
    a_cursor.setAttribute("material", "depthTest:false");

    a_camera.appendChild(a_cursor);
    return a_camera;
}

function getOnlineUsers() {
    this.socket.emit('getOnlineUsers');
}