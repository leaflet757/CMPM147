var app = {};

// A holder for lots of app-related functionality
define(["processing", "./threeUtils/threeScene", "common", "./particles/particle", "./customGrids"], function(_processing, ThreeScene, common, Particle, customGrids) {
	'use strict';

	// A little time object to keep track of the current time,
	//   how long its been since the last frame we drew,
	//   and how long the app has been running
	app.time = {
		date : Date.now(),
		start : Date.now(),
		total : 0,
		elapsed : .1,
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
		updateRate : .9,
		mouse : new Vector(),
		dimensions : new Vector(),

		// Final project data members
		// TODO: grid : new customGrids.GameOfLife(),
		clearBackground : false,
		useFade : false,

		init : function() {
			//  app.threeScene = new ThreeScene($("#threeview"));

			// Get the canvas element
			// Note that this is the jquery selector, and not the DOM element (which we need)
			// myJQuerySelector.get(0) will return the canvas element to pass to processing
			var canvas = $("#processingCanvas");
			app.updateTimer = 0;
			// Create the canvas

			var processingInstance = new Processing(canvas.get(0), function(g) {

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

				// Draw ONE-TIME things
				g.background(0, 0, 0);

				// TODO: create cells
				var count1 = app.dimensions.x / 30 - 1;
				var count2 = app.dimensions.y / 30 - 1;
				var padding = app.dimensions.x / count1;
				for (var i = 0; i < count1; i++) {
					for (var p = 0; p < count2; p++) {
						if (i < count1 - 1 && i != 0 && p != 0) {
							// TODO: spawn cell under this condition
							g.fill(0, 1, 1);
							g.ellipse(i * padding, p * padding, 3, 3);
						}
					}
				}

				g.draw = function() {
					// Update time
					app.time.updateTime();

					if (app.clearBackground) {
						app.clearBackground = false;
						g.fill(0, 0, 0);
						g.rect(0, 0, w, h);
					}

					// Fading background
					if (app.useFade) {
						g.fill(0, 0, 0, 0.03);
						g.rect(0, 0, w, h);
					}
					
					

					// Fixed update intervals
					app.updateTimer += app.time.elapsed;
					if (app.updateTimer > app.updateRate) {
						//console.log("update " + app.time.frames);
						app.updateTimer = 0;
						//app.grid.update(app.time);
					}
					// draw the cells
					//app.grid.draw(g);

				};
			});
			this.initUI();
		},
		toggle3D : function() {
			if (!app.is3D) {
				app.is3D = true;
				$("#threeview").show();
				//   $("#processingview").hide();
			} else {
				app.is3D = false;
				$("#threeview").hide();
				//  $("#processingview").show();
			}
			console.log("Threeview: " + app.is3D);

		},
		initUI : function() {

			$("#view").mousemove(function(ev) {
				var x = ev.offsetX - app.dimensions.x / 2;
				var y = ev.offsetY - app.dimensions.y / 2;
				console.log(x + " " + y);
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
				console.log(e.keyCode);

				switch(key) {
				case 'P':
					app.paused = !app.paused;
					break;
				case 'F':
					console.log("f pressed");
					app.useFade = !app.useFade;
					break;
				case 'C':
					app.clearBackground = true;
					break;
				case 'M':
					app.updateRate *= .8;
					console.log(app.updateRate);
					break;
				case 'N':
					app.updateRate /= .8;
					console.log(app.updateRate);
					break;
				case '1':

					break;
				case '2':

					break;
				case '3':

					break;
				};

			});

			$(document).keyup(function(e) {
				app.key = undefined;
			});

		}
	});

});
