(function() {
    /**
     * Geometry data
     * @class
     */
    var Geometry = function() {
        Geometry.superClass.constructor.call(this);

        this.uuid = zen3d.generateUUID();

        this.verticesArray = new Array();

        this.indicesArray = new Array();

        // maybe need something to discrib vertex format
        this.vertexSize = 17; // static

        // vertex format
        this.vertexFormat = {
            "a_Position": {size: 3, normalized: false, stride: 17, offset: 0},
            "a_Normal": {size: 3, normalized: false, stride: 17, offset: 3},
            "a_Uv": {size: 2, normalized: false, stride: 17, offset: 13}
        };

        this.usageType = zen3d.WEBGL_BUFFER_USAGE.STATIC_DRAW;

        this.boundingBox = new zen3d.Box3();

        this.boundingSphere = new zen3d.Sphere();

        this.dirty = true;

        // if part dirty, update part of buffers
        this.dirtyRange = {enable: false, start: 0, count: 0};
    }

    zen3d.inherit(Geometry, zen3d.EventDispatcher);

    Geometry.prototype.computeBoundingBox = function() {
        this.boundingBox.setFromArray(this.verticesArray, this.vertexSize);
    }

    Geometry.prototype.computeBoundingSphere = function() {
        this.boundingSphere.setFromArray(this.verticesArray, this.vertexSize);
    }

    Geometry.prototype.getVerticesCount = function() {
        return this.verticesArray.length / this.vertexSize;
    }

    Geometry.prototype.getIndicesCount = function() {
        return this.indicesArray.length;
    }

    Geometry.prototype.dispose = function() {
        this.dispatchEvent({type: 'dispose'});

        this.dirty = true;
    }

    zen3d.Geometry = Geometry;
})();
