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
    this.socket.on('handshake', function (isMobile, player) {
        if (!isMobile && player) {
            var a_entity = document.createElement(player.tag);
            a_entity.setAttribute("id", player.id);
            a_entity.setAttribute("position", player.position);
            a_entity.setAttribute('wasd-movement', "");

            var a_camera = createPlayerCamera();
            a_camera.setAttribute("follow-entity", "target:" + player.id + "; offset: 0 0.4 0;");

            document.querySelector('a-scene').appendChild(a_entity);
            document.querySelector('a-scene').appendChild(a_camera);

            // alert("Your mobile code is:\n\n'" + player.code + "'");
        } else if (isMobile) {
            var code = prompt("Please enter your mobile code after connecting with your desktop");

            self.socket.emit('check_code', code);
        }
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

    this.socket.on('attachToDesktopPlayer', function (id) {
        var player = document.getElementById(id);
        var a_camera = createPlayerCamera();
        player.appendChild(a_camera);
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
                if (entity.position) {
                    a_entity.object3D.position.x = entity.position.x;
                    a_entity.object3D.position.y = entity.position.y;
                    a_entity.object3D.position.z = entity.position.z;
                }
                if (entity.rotation) {
                    // a_entity.object3D.rotation.x = entity.rotation.x * Math.PI/180; //y-axis is trippy while in VR :)
                    a_entity.object3D.rotation.y = entity.rotation.y * Math.PI/180;
                }
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
    a_camera.setAttribute("mouse-lock", "");

    // a_camera.setAttribute("drag-look-controls-enabled", "false");
    a_camera.setAttribute("wasd-controls-enabled", "false"); // disable default wasd controls

    var a_cursor = document.createElement("a-cursor");
    a_cursor.setAttribute("id", "cursor");
    a_cursor.setAttribute("material", "depthTest:false");

    a_camera.appendChild(a_cursor);
    return a_camera;
}

function getOnlineUsers() {
    this.socket.emit('getOnlineUsers');
}