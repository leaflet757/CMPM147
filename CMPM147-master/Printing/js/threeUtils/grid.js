/**
 * @author Kate Compton
 */

define(["three", "common"], function(_three, common) {
    'use strict';
    // Dynamic geometry for a grid

    var Grid = function(columns, rows) {
        this.columns = columns;
        this.rows = rows;

        this.geo = new THREE.Geometry();
        this.verts = [];
        this.baseVerts = [];

        // Create vertices
        for (var i = 0; i < columns + 1; i++) {
            var pctX = i / columns;
            // Create a new column
            this.verts[i] = [];
            this.baseVerts[i] = [];

            for (var j = 0; j < rows + 1; j++) {
                var pctY = j / rows;
                var v = new Vector(i, j, Math.random() * 3);
                var v1 = new Vector(i, j, 40);

                this.verts[i][j] = v;
                this.baseVerts[i][j] = v;

                // be able to refer to this vertex by index
                v.vertIndex = this.geo.vertices.length;
                v.baseVert = v1;
                this.geo.vertices.push(v);
                v1.vertIndex = this.geo.vertices.length;
                this.geo.vertices.push(v1);

                v.uv = new THREE.Vector2(pctX, 1 - pctY);
                v1.uv = new THREE.Vector2(pctX, 1 - pctY);

            }
        }

        // Create faces
        for (var i = 0; i < columns; i++) {

            for (var j = 0; j < rows; j++) {

                var v0 = this.verts[i][j];
                var v1 = this.verts[i+ 1][j];
                var v2 = this.verts[i + 1][j + 1];
                var v3 = this.verts[i][j + 1];
                createFace(this.geo, v0, v1, v2, v3);
                createFace(this.geo, v3.baseVert, v2.baseVert, v1.baseVert, v0.baseVert);

            }
        }

        // connect up all the sides
        for (var i = 0; i < columns; i++) {
            var v0a = this.verts[i][0];
            var v1a = this.verts[i+ 1][0];

            var v0b = this.verts[i][rows];
            var v1b = this.verts[i+ 1][rows];

            createFace(this.geo, v0a, v1a, v1a.baseVert, v0a.baseVert);
            createFace(this.geo, v1b, v0b, v0b.baseVert, v1b.baseVert);

        }

        for (var i = 0; i < rows; i++) {
            var v0a = this.verts[0][i];
            var v1a = this.verts[0][i + 1];

            var v0b = this.verts[columns][i];
            var v1b = this.verts[columns][i + 1];

            createFace(this.geo, v0a, v1a, v1a.baseVert, v0a.baseVert);
            createFace(this.geo, v1b, v0b, v0b.baseVert, v1b.baseVert);

        }

        this.setNeedsUpdate();

    };

    function createFace(geo, v0, v1, v2, v3) {
        var f0 = new THREE.Face3(v0.vertIndex, v1.vertIndex, v2.vertIndex);
        var f1 = new THREE.Face3(v2.vertIndex, v3.vertIndex, v0.vertIndex);
        geo.faces.push(f0);
        geo.faces.push(f1);

        geo.faceVertexUvs[0].push([v0.uv, v1.uv, v2.uv]);
        geo.faceVertexUvs[0].push([v2.uv, v3.uv, v0.uv]);
    };

    function toObj() {
        console.log(this.geo);
        var s = "";
        for (var i = 0; i < this.geo.vertices.length; i++) {
            var v = this.geo.vertices[i];
            s += ("v " + v.x.toFixed(2) + " " + v.y.toFixed(2) + " " + v.z.toFixed(2)) + "\n";
        }

        for (var i = 0; i < this.geo.faces.length; i++) {
            var f = this.geo.faces[i];
            s += ("f " + (f.a + 1) + " " + (f.b + 1) + " " + (f.c + 1)) + "\n";
        }

        $("textarea#output").val(s);
    };

    Grid.prototype.toObj = toObj;

    Grid.prototype.setNeedsUpdate = function(fx) {
        this.geo.dynamic = true;

        this.geo.verticesNeedUpdate = true;

        this.geo.buffersNeedUpdate = true;
        this.geo.uvsNeedUpdate = true;

        this.geo.computeFaceNormals();
        this.geo.computeVertexNormals();
    };

    Grid.prototype.setToFunction = function(fx) {
        for (var i = 0; i < this.columns + 1; i++) {
            var pctX = i / this.columns;
            for (var j = 0; j < this.rows + 1; j++) {
                var pctY = j / this.rows;
                var v = this.verts[i][j];
                fx(pctX, pctY, v);
                v.baseVert.setTo(v);
                v.baseVert.mult(1.2);
                v.baseVert.z = -20;

            }
        }
        this.setNeedsUpdate();

    };

    return Grid;
});
