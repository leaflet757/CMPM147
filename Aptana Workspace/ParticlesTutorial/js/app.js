var app = {};
var particles = [];
var lineFollowers = [];
var numLineFollowers = 100;
var pentagramRadius = 200;

// A holder for lots of app-related functionality
define(["processing", "./particles/particleSystem", "./particles/flower", "./particles/particle"], function(_processing, ParticleSystem, Flower, Particle) {
	'use strict';

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

	function randomShape(g) {
		var x = Math.floor(Math.random() * g.width);
		var y = Math.floor(Math.random() * g.height);
		g.fill(Math.random(), 1, 1, Math.random() * 0.4 + 0.6);
		g.noStroke();
		var npoints = Math.random() * 5 + 3;
		var angle = 2 * Math.PI / npoints;
		var size = Math.random() * 90 + 10;
		g.beginShape();
		for (var a = 0; a < 2 * Math.PI; a += angle) {
			var sx = x + Math.cos(a) * size;
			var sy = y + Math.sin(a) * size;
			g.vertex(sx, sy);
		}
		g.endShape(g.CLOSE);
	}

	function pixelZoom(g) {
		
		// TODO:
		
		g.pixels.set(result);
		g.updatePixels();
	}

	function pixelSwapper(g) {
		
		g.loadPixels();
		var pixelArray = g.pixels.toArray();
		
		var x = Math.floor(Math.random() * (g.width / 2));
		var x2 = x + g.width / 2;
		var y = Math.floor(Math.random() * (g.height / 2));
		
		var width = Math.floor(Math.random() * ((g.width / 2) - (x % g.width)));
		var height = Math.floor(Math.random() * (g.height - y));
		//console.log(x, y, width, height);
		
        // Iterate through all the pixels of a w by h rectangle, starting at (x, y)
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                // Convert the x, y coordinates into the position in the 1 dimensional array of the buffer
                var index = (x + i) + (y + j) * g.width;
                var index2 = (x2 + i) + (y + j) * g.width;

                // Read the hue saturation and brightness of the color at this pixel
                var color = pixelArray[index];
                var color2 = pixelArray[index2];
                var hue = g.hue(color);
                var hue2 = g.hue(color2);
                var saturation = g.saturation(color);
                var sat2 = g.saturation(color2);
                var brightness = g.brightness(color);
                var brightness2 = g.brightness(color2);
                
                // and use it to make a new color
                pixelArray[index] = g.color(hue2, sat2, brightness2);
                pixelArray[index2] = g.color(hue, saturation, brightness);
            }
        }
        
        g.pixels.set(pixelArray);
		g.updatePixels();
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

	function drawStar(g) {
		for (var i = 0; i < particles.length; i++) {
			particles[i].update(time);
			particles[i].draw(g);
		}
		for (var i = 0; i < lineFollowers.length; i++) {
			lineFollowers[i].update(time);
		}
	}

	// Lets add some functions to the app object!
	$.extend(app, {

		mouse : new Vector(),
		dimensions : new Vector(),

		init : function() {
			console.log("Hello, World.");

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

				// Create a particle here
				for (var i = 0; i < numLineFollowers; i++) {
					var t = 2 * Math.PI / numLineFollowers * i;
					var p = convertThetaToPentagram(t);
					//console.log(p);
					lineFollowers[i] = new Particle.LineFollower(p.x, p.y, t);
					for (var j = 0; j < 10; j++) {
						particles[i + j] = new Particle.ParticleFollower(lineFollowers[i]);
					}
				}

				for (var i = 0; i < 50; i++) {
					//randomDot(g);
				}
				g.draw = function() {

					// Update time
					time.updateTime();

					// Update a particle here
					// HW Functions
					if (app.key === 1) {
						randomShape(g);
					}
					if (app.key === 2) {
						//pixelStreak(g);
						pixelSwapper(g);
					}
					if (app.key === 3) {
						// Move to the center of the canvas
						g.pushMatrix();
						g.translate(w / 2, h / 2);
						drawStar(g);
						g.popMatrix();
					}
					if (app.key === 4)
					{
						pixelZoom(g);				
					}

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
				case '4':
					app.key = 4;
					break;
				}

			});

			$(document).keyup(function(e) {
				app.key = undefined;
			});

		}
	});

});
