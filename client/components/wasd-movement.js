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
                if (self.keys[key] == false) {
                    self.keys[key] = true;

                    var rotationY = document.querySelector("a-camera").getAttribute("rotation").y; // Actually x axis :|
                    socket.emit("key_down", key, rotationY);
                }
            }
        };

        document.body.onkeyup = function (event) {
            var key = event.key;
            if (self.keys.hasOwnProperty(key)) {
                if (self.keys[key] == true)
                self.keys[key] = false;

                socket.emit("key_up", key);
            }
        };
    }
});