var sens = 1/25;

AFRAME.registerComponent('mouse-lock', {
    schema: {
        lockEnabled: { default: true },
        isLocked: { default: false },
        sensitivity: { default: sens }
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
                document.addEventListener("mousemove", self.mouseMove, false);
            } else {
                this.isLocked = false;
                document.removeEventListener("mousemove", self.mouseMove, false);
            }
        }
    },

    mouseMove: function (e) {
        var a_camera = document.querySelector("a-camera");

        var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        a_camera.getAttribute("rotation").y -= movementX * sens;
        a_camera.getAttribute("rotation").x -= movementY * sens;

        socket.emit("mouse_rotate", a_camera.getAttribute("rotation"));
    }

});