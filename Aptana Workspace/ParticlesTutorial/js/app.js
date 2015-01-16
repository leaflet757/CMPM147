var app = {};
var particles = [];
var circleParticle = {};
var lineFollower = {};
var lineFollowers = [];
var pentagramRadius = 200;

// A holder for lots of app-related functionality
define(["processing", "./particles/particleSystem", "./particles/flower", "./particles/particle"], function(_processing, ParticleSystem, Flower, Particle) {'use strict';

    // A little time object to keep track of the current time,
    //   how long its been since the last frame we drew,
    //   and how long the app has been running
    var time = {
        date : Date.now(),
        start : Date.now(),
        frames : 0,
        updateTime : function() {
            var last = this.date;
            this.date = Date.now();
            this.total = (this.date - this.start) / 1000;
            this.elapsed = (this.date - last) / 1000;

            this.frames++;
        }
    };

    function randomDot(g) {
        var x = Math.floor(Math.random() * g.width);
        var y = Math.floor(Math.random() * g.height);
        g.fill(Math.random(), 1, 1, .4);
        g.noStroke();
        g.ellipse(x, y, 100, 100);
    }

    function pixelStreak(g) {
        var offset = Math.floor(Math.random() * 100);
        g.loadPixels();
        var pixelArray = g.pixels.toArray();

        var x = Math.floor(Math.random() * g.width);
        var y = Math.floor(Math.random() * g.height);

        // Move a bunch of pixels to the right by 30 (wraparound)
        for (var i = 0; i < 1000; i++) {
            var index = x + y * g.width + i;
            pixelArray[index] = pixelArray[index + offset];
        }

        g.pixels.set(pixelArray);
        g.updatePixels();
    }

    // Lets add some functions to the app object!
    $.extend(app, {

        mouse : new Vector(),
        dimensions : new Vector(),
		
        init : function() {
            console.log("Hello, World.");

			pentagramRadius = 200;
			
            // Get the canvas element
            // Note that this is the jquery selector, and not the DOM element (which we need)
            // myJQuerySelector.get(0) will return the canvas element to pass to processing
            var canvas = $("#processingCanvas");
            var processingInstance = new Processing(canvas.get(0), function(g) {

                // This function is called once processing is initialized.

                // Set the size of processing so that it matches that size of the canvas element
                var w = canvas.width();
                var h = canvas.height();
                app.dimensions.setTo(w, h);
	
				console.log(w, h);

                g.size(w, h);

                // Tell processing that we'll be defining colors with
                //  the HSB color mode, with values [0, 1]
                g.colorMode(g.HSB, 1);

                // Tell processing to define ellipses as a center and a radius
                g.ellipseMode(g.CENTER_RADIUS);

                // Start with a black background
                // g.background(.5);

                // You can specify backgrounds with one value, for greyscale,
                //  g.background(.65);

                // or with 3 for HSB (or whatever color mode you are using)

                // You can even have a background that is *transparent*
                // g.background(0, 0, 0, 0);

                // Set processing's draw function

                g.background(0.7, .6, .9);

                // [TODO] Create a particle here
				for (var i = 0; i < 100; i++)
				{
					particles[i] = new Particle();
				}
				
				//var particle = new Particle();
				circleParticle.position = new Vector(200, 0);
				lineFollower = new LineFollower(200, 0, 0);

                for (var i = 0; i < 50; i++) {
                    //randomDot(g);
                }
                g.draw = function() {

                    // Update time
                    time.updateTime();

                    // [TODO] Update a particle here

                    g.fill(0.7, .6, .9, .01);
                    g.rect(0, 0, w, h);
                    
                    // draw the circle and the pentagram
                    g.fill(0,1,1,0);
                    g.ellipse(w/2,h/2,pentagramRadius,pentagramRadius);
                    g.line(200 + w/2, 0 + h/2,-161.803 + w/2,117.557 + h/2);
                    g.line(-161.803 + w/2,117.557 + h/2, 61.803 + w/2, -190.211 + h/2);
                    g.line(61.803 + w/2, -190.211 + h/2, 61.803 + w/2, 190.211 + h/2);
                    g.line(61.803 + w/2, 190.211 + h/2, -161.803 + w/2, -117.557 + h/2);
                    g.line(-161.803 + w/2, -117.557 + h/2, 200 + w/2, 0 + h/2);

                    // Move to the center of the canvas
                    g.pushMatrix();
                    g.translate(w / 2, h / 2);

                    // [TODO] Draw a particle here                    
					for (var i =0; i < particles.length; i++)
					{
						//particles[i].update(time);
						//particles[i].draw(g);
					}
					//particle.update(time);
					//particle.draw(g);
					
					g.fill(0.4, 1,1);
					g.ellipse(circleParticle.position.x, circleParticle.position.y, 5, 5);
					var theta = time.total * 0.3 % (2 * Math.PI);
					circleParticle.position = new Vector(pentagramRadius * Math.cos(theta), -pentagramRadius * Math.sin(theta));
					

					lineFollower.update(time);
					lineFollower.draw(g);

                    g.popMatrix();

                    // HW Functions
                    /*
                     if (app.key === 1) {
                     randomDot(g);
                     }
                     if (app.key === 2) {
                     pixelStreak(g);
                     }
                     */

                };
            });
            this.initUI();
        },

        initUI : function() {

            $("#view").mousemove(function(ev) {
                var x = ev.offsetX - app.dimensions.x / 2;
                var y = ev.offsetY - app.dimensions.y / 2;
                //    console.log(x + " " + y);
                app.mouse.setTo(x, y);
            });

            // using the event helper
            $('#view').mousewheel(function(event) {

            });

            $("#view").draggable({
                helper : function() {
                    return $("<div id='dragPos'></div>");
                },

                drag : function(event, ui) {
                    var x = $('#dragPos').offset().left;
                    var y = $('#dragPos').offset().top;

                }
            });

            $(document).keydown(function(e) {

                var key = String.fromCharCode(e.keyCode);

                switch(key) {
                    case ' ':
                        app.paused = !app.paused;
                        break;
                    case '1':
                        // Do something when the user
                        app.key = 1;
                        break;

                    case '2':
                        // Do something
                        app.key = 2;
                        break;
                    case '3':
                        app.key = 3;
                        // Do something
                        break;
                }

            });

            $(document).keyup(function(e) {
                app.key = undefined;
            });

        }
    });

});
