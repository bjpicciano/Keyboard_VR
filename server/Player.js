var Player = function (id, code) {
    this.id = id;
    this.code = code;
    this.tag = "a-box";
    this.position = {x: 0, y: 1, z: 0};
    this.direction = 0;
    this.previousPosition = {x: 0, y: 0, z: 0};
    this.syncData = {};

    this.keys = {
        w: false,
        a: false,
        s: false,
        d: false
    };

    this.velocity = 0.1;

    this.tick = function () {
        this.handleInput();
    };

    this.handleInput = function () {
        var dx = 0, dz = 0, direction = this.direction;

        if (this.keys.w) {
            dx = Math.sin(direction) * -this.velocity;
            dz = Math.cos(direction) * -this.velocity;
        }
        if (this.keys.s) {
            dx = Math.sin(direction) * this.velocity;
            dz = Math.cos(direction) * this.velocity;
        }
        if (this.keys.a) {
            direction = this.direction - Math.PI/2;
            dx = Math.sin(direction) * this.velocity;
            dz = Math.cos(direction) * this.velocity;
        }
        if (this.keys.d) {
            direction = this.direction + Math.PI/2;
            dx = Math.sin(direction) * this.velocity;
            dz = Math.cos(direction) * this.velocity;
        }

        if (dx != 0 || dz != 0) {
            this.previousPosition.x = this.position.x;
            this.previousPosition.z = this.position.z;

            this.position.x += dx;
            this.position.z += dz;

            this.syncData.id = this.id;
            this.syncData.position = Object.assign({}, this.position);
        }
    };
};

module.exports = Player;