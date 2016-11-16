var Player = function (id, code) {
    this.id = id;
    this.code = code;
    this.tag = "a-box";
    this.position = {x: 0, y: 1, z: 0};
    this.rotation = {x: 0, y: 0};
    this.previousPosition = {x: 0, y: 0, z: 0};
    this.previousRotation = {x: 0, y: 0};
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
        //Direction needs to be kept updated
        var dx = 0, dz = 0, direction = this.rotation.y * Math.PI/180;

        if (this.keys.w) {
            dx += Math.sin(direction) * -this.velocity;
            dz += Math.cos(direction) * -this.velocity;
        }
        if (this.keys.s) {
            dx += Math.sin(direction) * this.velocity;
            dz += Math.cos(direction) * this.velocity;
        }
        if (this.keys.a) {
            dx += Math.sin(direction - Math.PI/2) * this.velocity;
            dz += Math.cos(direction - Math.PI/2) * this.velocity;
        }
        if (this.keys.d) {
            dx += Math.sin(direction + Math.PI/2) * this.velocity;
            dz += Math.cos(direction + Math.PI/2) * this.velocity;
        }

        if (dx != 0 || dz != 0) {
            this.previousPosition.x = this.position.x;
            this.previousPosition.z = this.position.z;

            this.position.x += dx;
            this.position.z += dz;

            this.syncData.id = this.id;
            this.syncData.position = Object.assign({}, this.position);
        }

        if (this.previousRotation.x != this.rotation.x || this.previousRotation.y != this.rotation.y) {
            this.previousRotation.x = this.rotation.x;
            this.previousRotation.y = this.rotation.y;

            this.syncData.id = this.id;
            this.syncData.rotation = Object.assign({}, this.rotation);
        }
    };
};

module.exports = Player;