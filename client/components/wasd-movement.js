AFRAME.registerComponent('wasd-movement', {
    schema: {
        type: 'vec3',
        default: {x:0, y:0, z:0}
    },

    keys: {
        w: false,
        a: false,
        s: false,
        d: false
    },

    velocity: 0.1,

    tick: function (t) {
        this.handleInput();

    },

    handleInput: function () {
        var self = this;
        document.body.onkeydown = function (event) {
            var key = event.key;
            if (self.keys.hasOwnProperty(key)) {
                self.keys[key] = true;
                socket.emit("key_down", key);
            }
        };

        document.body.onkeyup = function (event) {
            var key = event.key;
            if (self.keys.hasOwnProperty(key)) {
                self.keys[key] = false;
                socket.emit("key_up", key);
            }
        };
    }
});