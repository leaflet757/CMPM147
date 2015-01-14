var app = {};

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

    // Lets add some functions to the app object!
    $.extend(app, {

        mouse : new Vector(),
        dimensions : new Vector(),

        init : function() {

            // Make a particle system (for later in the tutorial)
            var particleSystem = new ParticleSystem();

            for (var i = 0; i < 10; i++) {
                particleSystem.add(new Particle());
            }

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

                g.size(w, h);

                // Tell processing that we'll be defining colors with
                //  the HSB color mode, with values [0, 1]
                g.colorMode(g.HSB, 1);

                // Tell processing to define ellipses as a center and a radius
                g.ellipseMode(g.CENTER_RADIUS);

                // Start with a black background
                //g.background(0);

                // You can specify backgrounds with one value, for greyscale,
                //  g.background(.65);

                // or with 3 for HSB (or whatever color mode you are using)
                // g.background(.65, 1, .3);

                // You can even have a background that is *transparent*
                // g.background(0, 0, 0, 0);

                // Set processing's draw function
                g.draw = function() {

                    // Update time
                    time.updateTime();

                    // Move to the center of the canvas
                    g.pushMatrix();
                    g.translate(w / 2, h / 2);

                    // Draw some stuff here

                    g.popMatrix();
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
                        // Do something
                        break;

                    case '2':
                        // Do something
                        break;
                    case '3':
                        // Do something
                        break;
                }

            });
        }
    });

});

// Class edited version
/*
var app = {};

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

    // Lets add some functions to the app object!
    $.extend(app, {

        mouse : new Vector(),
        dimensions : new Vector(),

        init : function() {
		
			console.log("HellovWorld");

            // Make a particle system (for later in the tutorial)
            var particleSystem = new ParticleSystem();

            for (var i = 0; i < 10; i++) {
                particleSystem.add(new Particle());
            }

            // Get the canvas element
            // Note that this is the jquery selector, and not the DOM element (which we need)
            // myJQuerySelector.get(0) will return the canvas element to pass to processing
            var canvas = $("#processingCanvas");
            var processingInstance = new Processing(canvas.get(0), function(g) {
				//console.log(g);
                // This function is called once processing is initialized.

                // Set the size of processing so that it matches that size of the canvas element
                var w = canvas.width();
                var h = canvas.height();
                app.dimensions.setTo(w, h);

                g.size(w, h);

                // Tell processing that we'll be defining colors with
                //  the HSB color mode, with values [0, 1]
                g.colorMode(g.HSB, 1);

                // Tell processing to define ellipses as a center and a radius
                g.ellipseMode(g.CENTER_RADIUS);

                // Start with a black background
                //g.background(1);

                // You can specify backgrounds with one value, for greyscale,
                //g.background(.65);

                // or with 3 for HSB (or whatever color mode you are using)
                g.background(0.53, 1, .7);

                // You can even have a background that is *transparent*
                // g.background(0, 0, 0, 0);
				
				/*g.fill(.8,1,1)
				//g.stroke(0)
				//g.strokeWeight(9)
				g.ellipse(90, 0, 100, 100)

				for (var i = 0; i < 400; i++)
				{
					var x = Math.random() * app.dimensions.x;
					var y = Math.random() * app.dimensions.y;
					g.ellipse(x, y, 5, 5)
				}
				
                // Set processing's draw function
				var hue = 0;
				var radius = 10;
				
				var particles = [];
				
				for (var i = 0; i < 100; i++)
				{
					var x = Math.random() * app.dimensions.x;
					var y = Math.random() * app.dimensions.y;
					particles[i] = [x,y];
				}
				
                g.draw = function() {

					// clear bufferD
					//g.background(0.53, 1, .7);
				
                    // Update time
                    time.updateTime();
					
					//g.fill(0.5,.2,.1,.01);
					//g.rect(0,0,w,h);
					
					g.fill(hue,1,1,0);
					hue = (hue+0.01)%1;
					radius = (radius*1.01)%50+5
					
					particles.forEach(function(p) 
					{
						p[0]++;
						
					});
					
					var x = Math.random() * app.dimensions.x;
					var y = Math.random() * app.dimensions.y;
					g.ellipse(x, y, radius, radius)

                    // Move to the center of the canvas
                    g.pushMatrix();
                    g.translate(w / 2, h / 2);

                    // Draw some stuff here

                    g.popMatrix();
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
                        // Do something
                        console.log('key 1 is pressed');
                        break;
                    case '2':
                        // Do something
                        console.log('key 2 is pressed');
                        break;
                    case '3':
                        // Do something
                        console.log('key 3 is pressed');
                        break;
                }

            });
        }
    });

});
*/