var app = {};

// A holder for lots of app-related functionality
define(["processing", "./particles/particle", "interaction/audio", "interaction/leapMotion", "interaction/gamepad", "interaction/webcam", "common"], function(_processing, Particle, audio, leap, gamepad, webcam, common) {
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

	function randomDot(g) {
		var x = Math.floor(Math.random() * g.width);
		var y = Math.floor(Math.random() * g.height);
		var hue = Math.random();
		g.fill(hue, 1, 1, .4);
		g.noStroke();
		g.stroke(hue, 1, .0, .1);
		g.strokeWeight(5);
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

	function recolorBlock(g) {
		var offset = Math.floor(Math.random() * 100);
		g.loadPixels();
		var pixelArray = g.pixels.toArray();

		var x = Math.floor(Math.random() * g.width);
		var y = Math.floor(Math.random() * g.height);
		var w = 650;
		var h = 230;

		// Iterate through all the pixels of a w by h rectangle, starting at (x, y)
		for (var i = 0; i < w; i++) {
			for (var j = 0; j < h; j++) {
				// Convert the x, y coordinates into the position in the 1 dimensional array of the buffer
				var index = (x + i + Math.round(.1 * j * j)) + (y + j) * g.width;

				// Read the hue saturation and brightness of the color at this pixel
				var color = pixelArray[index];
				var hue = g.hue(color);
				var saturation = g.saturation(color);
				var brightness = g.brightness(color);
				hue = (hue + .2) % 1;
				// and use it to make a new color
				pixelArray[index] = g.color(hue, saturation, brightness * 2 - 1);
			}
		}

		g.pixels.set(pixelArray);
		g.updatePixels();
	}

	function addParticles() {
		console.log("add particles");
		app.particles = [];
		for (var i = 0; i < 30; i++) {
			app.particles[i] = new Particle();
		}
	};

	function sortFingers() {
		for (var i = 0; i < app.fingersOnScreen; i++) {
			app.points[i] = app.fingers[i].clone();
		}
		var tempVec = new Vector();
		for (var i = 1; i < app.points.length; i++) {
			var j = i;
			while (j > 0) {
				if (app.points[j - 1].x > app.points[j].x) {
					tempVec.setTo(app.points[j]);
					app.points[j].setTo(app.points[j - 1]);
					app.points[j - 1].setTo(tempVec);
				}
				j--;
			}
		}
		app.sidePoints[0].setTo(0, app.points[0].y / 2);
		app.sidePoints[1].setTo(app.dimensions.x, app.points[app.points.length - 1].y / 2);
	};

	function drawRectangles(g, splits, w, h) {
		g.pushMatrix();
		g.translate(-w / 2, h / 2);
		var rectScale = 3;
		for (var i = 0; i < splits; i++) {
			// draw the corresponding rectagles
			var rectw = w / splits;
			var recth = rectScale * -1 * app.points[i].y;
			var rectx = i * rectw;
			var recty = -recth;
			g.noStroke();
			app.fingerColors[i].fill(g, 0.3, 0);
			g.rect(rectx, recty, rectw, recth);
			if (recth < 0) {
				app.fingerColors[i] = new common.KColor(utilities.noise(rectx, recty), 1, 1);
			}
		}
		g.popMatrix();
	};

	function drawLines(g, splits, w, h) {
		// app.points
		// app.sidePoints
		g.pushMatrix();
		//g.translate(-w / 2 + 100, h/2);
		var lineScale = 3;
		//var translation = new Vector(-100, 100);
		for (var i = 0; i <= app.fingersOnScreen; i++) {
			g.noStroke();
			g.beginShape();
			if (i == 0) {
				app.sideColors[0].fill(g, 0.3, 0);
				g.vertex(-w / 2, h / 2);
				g.vertex(-w / 2, h / 2);
				g.vertex(app.points[i].x, app.points[i].y * lineScale + h / 2);
				g.vertex(app.points[i].x, h / 2);
				if (app.points[i].y > 0) {
					app.sideColors[0] = new common.KColor(Math.random(), 1, 1);
				}
			} else if (i == splits) {
				app.fingerColors[i - 1].fill(g, 0.3, 0);
				g.vertex(app.points[i - 1].x, h / 2);
				g.vertex(app.points[i - 1].x, app.points[i - 1].y * lineScale + h / 2);
				g.vertex(w / 2, h / 2);
				g.vertex(w / 2, h / 2);
				if (app.points[i - 1].y > 0) {
					app.fingerColors[i - 1] = new common.KColor(Math.random(), 1, 1);
				}
			}
			// do other stuff
			else {
				app.fingerColors[i - 1].fill(g, 0.3, 0);
				g.vertex(app.points[i - 1].x, h / 2);
				g.vertex(app.points[i - 1].x, app.points[i - 1].y * lineScale + h / 2);
				g.vertex(app.points[i].x, app.points[i].y * lineScale + h / 2);
				g.vertex(app.points[i].x, h / 2);
				if (app.points[i].y > 0) {
					app.fingerColors[i] = new common.KColor(Math.random(), 1, 1);
				}
			}
			g.endShape(g.CLOSE);
		}
		g.popMatrix();
	};

	function drawCurves(g, splits, w, h) {
		// app.points
		// app.sidePoints
		g.pushMatrix();
		//g.translate(-w / 2 + 100, h/2);
		var lineScale = 3;
		//var translation = new Vector(-100, 100);
		for (var i = 0; i <= app.fingersOnScreen; i++) {
			g.noStroke();
			g.beginShape();
			if (i == 0) {
				app.sideColors[0].fill(g, 0.3, 0);
				g.vertex(-w / 2, h / 2);
				g.vertex(-w / 2, h / 2);
				g.vertex(app.points[i].x, app.points[i].y * lineScale + h / 2);
				g.vertex(app.points[i].x, h / 2);
				if (app.points[i].y > 0) {
					app.sideColors[0] = new common.KColor(Math.random(), 1, 1);
				}
			} else if (i == splits) {
				app.fingerColors[i - 1].fill(g, 0.3, 0);
				g.vertex(app.points[i - 1].x, h / 2);
				g.vertex(app.points[i - 1].x, app.points[i - 1].y * lineScale + h / 2);
				g.vertex(w / 2, h / 2);
				g.vertex(w / 2, h / 2);
				if (app.points[i - 1].y > 0) {
					app.fingerColors[i - 1] = new common.KColor(Math.random(), 1, 1);
				}
			}
			// do other stuff
			else {
				app.fingerColors[i - 1].fill(g, 0.3, 0);
				g.vertex(app.points[i - 1].x, h / 2);
				g.curveVertex(app.points[i - 1].x, app.points[i - 1].y * lineScale + h / 2);
				g.vertex(app.points[i].x, app.points[i].y * lineScale + h / 2);
				g.vertex(app.points[i].x, h / 2);
				g.vertex(app.points[i - 1].x, h / 2);
				if (app.points[i].y > 0) {
					app.fingerColors[i] = new common.KColor(Math.random(), 1, 1);
				}
			}
			g.endShape(g.CLOSE);
		}
		g.popMatrix();
	};

	// Lets add some functions to the app object!
	$.extend(app, {

		mouse : new Vector(),
		dimensions : new Vector(),

		init : function() {
			app.particles = [];
			app.fingerColors = [];
			app.sideColors = [];
			app.fingersOnScreen = 1;
			app.points = [];
			app.sidePoints = [new Vector(), new Vector()];
			// points on the left and right side of screen
			app.drawStates = [false, false, false];
			app.erase = false;

			//audio.startAudio();
			//audio.captureMic();
			// add audio particles
			// for (var i = 0; i < 20; i++) {
			// var p = new Particle.AudioParticle();
			// app.particles.push(p);
			// }

			leap.createFingers();

			// Create random colors for each finger
			for (var i = 0; i < 10; i++) {
				var hue = Math.random();
				var sat = Math.random() * 0.3 + 0.7;
				var bri = Math.random() * 0.3 + 0.7;
				var tra = Math.random() * 0.1 + 0.7;
				app.fingerColors[i] = new common.KColor(hue, sat, bri, tra);
			}
			for (var i = 0; i < 2; i++) {
				var hue = Math.random();
				var sat = Math.random() * 0.3 + 0.7;
				var bri = Math.random() * 0.3 + 0.7;
				var tra = Math.random() * 0.1 + 0.7;
				app.sideColors[i] = new common.KColor(hue, sat, bri, tra);
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
				// g.background(.5);

				// You can specify backgrounds with one value, for greyscale,
				//  g.background(.65);

				// or with 3 for HSB (or whatever color mode you are using)

				// You can even have a background that is *transparent*
				// g.background(0, 0, 0, 0);

				// Set processing's draw function

				g.background(.84, .4, 0.8);

				g.draw = function() {

					// Update time
					time.updateTime();

					// [TODO] Update a particle here

					for (var i = 0; i < app.particles.length; i++) {
						app.particles[i].update(time);
					}

					if (time.frames % 5 == 0 && app.erase) {
						g.fill(0, 0, 0.4, 0.7);
						g.rect(0, 0, w, h);
					}

					// Move to the center of the canvas
					g.pushMatrix();
					g.translate(w / 2, h / 2);

					// [TODO] Draw a particle here

					for (var i = 0; i < app.particles.length; i++) {
						//app.particles[i].draw(g);
					}

					var splits = 1;

					// Draw the fingers
					if (app.fingers) {
						splits = app.fingersOnScreen;
						if (app.erase) {
							for (var i = 0; i < app.fingers.length; i++) {
								g.stroke(i * .1, .4, 1, .2);
								g.noFill();
								app.fingers[i].drawCircle(g, 10);

							}
						}
						if (app.fingersOnScreen > 0) {
							sortFingers();

							if (app.drawStates[0]) {
								drawRectangles(g, splits, w, h);
							}

							if (app.drawStates[1]) {
								drawLines(g, splits, w, h);
							}

							if (app.drawStates[2]) {
								drawCurves(g, splits, w, h);
							}

						}
					}

					g.popMatrix();

					// HW Functions

					if (app.key === 1) {
						randomDot(g);
					}
					if (app.key === 2) {
						pixelStreak(g);
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
					app.dancer.pause();
					break;
				case '1':
					// Do something when the user
					app.key = 1;
					break;

				case 'W':
					// Do something when the user
					addParticles();
					break;

				case '2':
					// Do something
					app.key = 2;
					break;
				case '3':
					app.key = 3;
					// Do something
					break;
				case 'A':
					app.drawStates[0] = true;
					app.drawStates[1] = false;
					app.drawStates[2] = false;
					break;
				case 'S':
					app.drawStates[0] = false;
					app.drawStates[1] = true;
					app.drawStates[2] = false;
					break;
				case 'D':
					app.drawStates[0] = false;
					app.drawStates[1] = false;
					app.drawStates[2] = true;
					break;
				case 'C':
					app.erase = !app.erase;
					break;
				}

			});

			$(document).keyup(function(e) {
				app.key = undefined;
			});

		}
	});

});
