var Player = function (id) {
    this.id = id;
    this.tag = "a-box";
    this.position = {x: 0, y: 1, z: 0};
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
        var x = 0, z = 0;

        if (this.keys.w) {
            z -= this.velocity;
        }
        if (this.keys.a) {
            x -= this.velocity;
        }
        if (this.keys.s) {
            z += this.velocity;
        }
        if (this.keys.d) {
            x += this.velocity;
        }

        if (x != 0 || z != 0) {
            this.previousPosition.x = this.position.x;
            this.previousPosition.z = this.position.z;

            this.position.x += x;
            this.position.z += z;

            this.syncData.id = this.id;
            this.syncData.position = Object.assign({}, this.position);
        }
    };
};

module.exports = Player;