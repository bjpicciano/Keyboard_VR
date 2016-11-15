AFRAME.registerComponent('mouse-lock', {
    schema: {
        lockEnabled: { default: true },
        isLocked: { default: false },
        sensitivity: { default: 1 / 30 }
    },

    init : function () {
        var canvas = this.el.sceneEl.canvas;

        canvas.requestPointerLock = canvas.requestPointerLock ||
            canvas.mozRequestPointerLock;

        document.exitPointerLock = document.exitPointerLock ||
            document.mozExitPointerLock;

        canvas.onclick = function() {
            canvas.requestPointerLock();
        };

        // Hook pointer lock state change events for different browsers
        document.addEventListener('pointerlockchange', lockChangeAlert, false);
        document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

        var self = this;
        function lockChangeAlert() {
            if ((document.pointerLockElement === canvas ||
                document.mozPointerLockElement === canvas)) {
                this.isLocked = true;
                console.log('The pointer lock status is now locked');
                document.addEventListener("mousemove", self.mouseMove, false);
            } else {
                this.isLocked = false;
                console.log('The pointer lock status is now unlocked');
                document.removeEventListener("mousemove", self.mouseMove, false);
            }
        }
    },

    mouseMove: function (e) {
        console.log(e)
    }

});