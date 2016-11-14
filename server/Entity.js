var Entity = function (id) {
    this.id = id;
    this.tag = "a-box";
    this.position = {x: 0, y: 1, z: 0};
    this.previousPosition = {x: 0, y: 0, z: 0};
    this.syncData = {id: this.id};
    
    this.keys = {
        w: false,
        a: false,
        s: false,
        d: false
    };
    
    this.velocity = 0.1;
    
    this.tick = function () {
        if (this.previousPosition != this.position) {
            this.syncData.position = this.position;
        }
        
        this.previousPosition.x = this.position.x;
        this.previousPosition.y = this.position.y;
        this.previousPosition.z = this.position.z;

        // this.position.z -= 0.007;
        this.handleInput();
    };
    
    this.handleInput = function () {
        if (this.keys.w) {
            this.position.z -= this.velocity;
        }
        if (this.keys.a) {
            this.position.x -= this.velocity;
        }
        if (this.keys.s) {
            this.position.z += this.velocity;

        }
        if (this.keys.d) {
            this.position.x += this.velocity;
        }
        console.log(this.position)
    };
};

module.exports = Entity;