(function() {
    /**
     * Object3D
     * @class
     */
    var Object3D = function() {

        // a custom name for this object
        this.name = "";

        // type of this object, set by subclass
        this.type = "";

        // position
        this.position = new zen3d.Vector3();
        // scale
        this.scale = new zen3d.Vector3(1, 1, 1);

        // euler rotate
        var euler = this.euler = new zen3d.Euler();
        // quaternion rotate
        var quaternion = this.quaternion = new zen3d.Quaternion();

        // bind euler and quaternion
        euler.onChange(function() {
            quaternion.setFromEuler(euler, false);
        });
        quaternion.onChange(function() {
            euler.setFromQuaternion(quaternion, undefined, false);
        });

        // transform matrix
        this.matrix = new zen3d.Matrix4();
        // world transform matrix
        this.worldMatrix = new zen3d.Matrix4();

        // children
        this.children = new Array();
        // parent
        this.parent = null;

        // shadow
        this.castShadow = false;
        this.receiveShadow = false;

        // frustum test
        this.frustumCulled = true;
    }

    Object.defineProperties(Object3D.prototype, {
        /**
         * rotation set by euler
         **/
        rotation: {
            get: function() {
                return this.euler;
            },
            set: function(euler) {
                var _euler = this.euler;
                _euler.copyFrom(euler);

                this.quaternion.setFromEuler(euler);
            }
        }
    });

    /**
     * add child to object3d
     */
    Object3D.prototype.add = function(object) {
        this.children.push(object);
        object.parent = this;
    }

    /**
     * remove child from object3d
     */
    Object3D.prototype.remove = function(object) {
        var index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
        object.parent = null;
    }

    /**
     * get object by name
     */
    Object3D.prototype.getObjectByName = function(name) {
        return this.getObjectByProperty('name', name);
    }

    /**
     * get object by property
     */
    Object3D.prototype.getObjectByProperty = function(name, value) {
        if (this[name] === value) return this;

        for (var i = 0, l = this.children.length; i < l; i++) {

            var child = this.children[i];
            var object = child.getObjectByProperty(name, value);

            if (object !== undefined) {

                return object;

            }

        }

        return undefined;
    }

    /**
     * update matrix
     */
    Object3D.prototype.updateMatrix = function() {
        var matrix = this.matrix.transform(this.position, this.scale, this.quaternion);

        this.worldMatrix.copy(matrix);

        if (this.parent) {
            var parentMatrix = this.parent.worldMatrix;
            this.worldMatrix.premultiply(parentMatrix);
        }

        var children = this.children;
        for (var i = 0, l = children.length; i < l; i++) {
            children[i].updateMatrix();
        }
    }

    /*
     * get world direction
     * must call after world matrix updated
     */
    Object3D.prototype.getWorldDirection = function() {

        var position = new zen3d.Vector3();
        var quaternion = new zen3d.Quaternion();
        var scale = new zen3d.Vector3();

        return function getWorldDirection(optionalTarget) {

            var result = optionalTarget || new zen3d.Vector3();

            this.worldMatrix.decompose(position, quaternion, scale);

            result.set(0, 0, 1).applyQuaternion(quaternion);

            return result;

        };
    }();

    /**
     * raycast
     */
    Object3D.prototype.raycast = function() {
        // implemental by subclass
    }

    zen3d.Object3D = Object3D;
})();