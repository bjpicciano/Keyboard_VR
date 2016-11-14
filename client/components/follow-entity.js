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
        var object3D = this.el.object3D;
        
        if (target) {
            var offset = this.data.offset;
            var targetPos = document.querySelector(target).object3D.getWorldPosition();

            object3D.position.set(targetPos.x + offset.x, targetPos.y + offset.y, targetPos.z + offset.z);
        }
    }
});