/**
 * I don't think i actually need this
 */
AFRAME.registerComponent('sync-position', {
    schema: {
        default: "position"
    },

    tick: function (t) {
        var object3D = this.el.object3D;
        var movement = this.data;

        object3D.translateX(movement.x);
        object3D.translateY(movement.y);
        object3D.translateZ(movement.z);
    }
});