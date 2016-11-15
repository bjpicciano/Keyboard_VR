AFRAME.registerComponent('follow-entity', {
    schema: {
        target: {
            default: ''
        },
        offset: {
            type: 'vec3',
            default: {x:0, y:0, z:0}
        }
    },

    tick: function (t) {
        var target = this.data.target;

        if (target) {
            var offset = this.data.offset;
            var targetPos = document.getElementById(target).object3D.getWorldPosition();

            var me = document.getElementById(this.el.id);
            me.getAttribute("position").x = targetPos.x + offset.x;
            me.getAttribute("position").y = targetPos.y + offset.y;
            me.getAttribute("position").z = targetPos.z + offset.z;
        }
    }
});