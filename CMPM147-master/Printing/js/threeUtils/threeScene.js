/**
 * @author Kate Compton
 */

define(["three", "common", "./orbitalCamera", "./grid"], function(_three, common, OrbitalCamera, Grid) {
    'use strict';

    var ThreeScene = function(div) {
        var threeScene = this;
        console.log("Create three scene");
        this.phiCenter = .2;
        this.thetaCenter = .2;
        this.thetaOffset = 0;

        // Create an orbital camera (ie, a camera that orbits around a vector position)
        this.camera = new OrbitalCamera();

        this.renderer = new THREE.WebGLRenderer({
            alpha : true
        });

        // Make a clear background
        this.renderer.setClearColor(0x000000, 0);

        // Set the dimensions (for the renderer);
        var w = div.width();
        var h = div.height();
        this.renderer.setSize(w, h);

        // Add the rendering to the selected div
        div.append(this.renderer.domElement);

        // Create a scene, and a 3D object to attach things to
        this.scene = new THREE.Scene();
        this.world = new THREE.Object3D();
        this.scene.add(this.world);

        var material = new THREE.MeshLambertMaterial({
            color : 0xCCFFFF,
            side : THREE.DoubleSide,
            //shading : THREE.SmoothShading
        });

        this.sphere = new THREE.Mesh(new THREE.SphereGeometry(30, 16, 16), material);
        // this.world.add(this.sphere);

        this.terrainGeometry = new Grid(30, 30);
        this.terrain = new THREE.Mesh(this.terrainGeometry.geo, material);
        this.world.add(this.terrain);

        this.createLights(this.world);

        // Set the render loop
        this.animate();

    };

    ThreeScene.prototype.createLights = function(root) {
        var lightCount = 3;
        for (var i = 0; i < lightCount; i++) {
            var theta = Math.PI * 2 * i / lightCount + this.thetaCenter;
            var r = 240 - i * 40;
            var color = new common.KColor(i * .24 + .54, .4 - i * .1, 1);

            var light = new THREE.PointLight(color.toHex(), .5 + .3 * i);
            var cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshNormalMaterial());
            // light.add(cube);
            light.position.set(r * Math.cos(theta), r * Math.sin(theta), 50 + 60 * i);
            root.add(light);
        }

    };



    ThreeScene.prototype.render = function() {

        this.renderer.render(this.scene, this.camera.camera);
    };

    ThreeScene.prototype.update = function() {
        this.thetaOffset += .007;
        this.camera.theta = this.thetaCenter + this.thetaOffset;
        this.camera.phi = this.phiCenter + .2 * Math.cos(app.time.total * .9);
        this.camera.update();
    };

    ThreeScene.prototype.animate = function() {
        var threeScene = this;

        // shim layer with setTimeout fallback
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();

        // usage:
        // instead of setInterval(render, 16) ....

        (function animloop() {
            requestAnimFrame(animloop);
            threeScene.update();
            threeScene.render();
        })();
        // place the rAF *before* the render() to assure as close to
        // 60fps with the setTimeout fallback.
    };
    return ThreeScene;
});
