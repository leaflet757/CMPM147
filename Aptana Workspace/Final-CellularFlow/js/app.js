// TODO LIST:
// Check vectors
// start working on boids

var app = {};

// A holder for lots of app-related functionality
define(["processing", "./threeUtils/threeScene", "common", "./particles/particle", "./customGrids", "./cellularGrid/cellGrid", "./boids/flockManager"], function(_processing, ThreeScene, common, Particle, customGrids, cellGrid, FlockManager) {
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
		updateRate : 2,
		mouse : new Vector(),
		prevMouse : new Vector(),
		mouseIsDown : false,
		firstClick : true,
		draggins : false,
		dimensions : new Vector(),

		// Final project data members
		clearBackground : false,
		useFade : true,
		drawCells : false,
		updateGrid : false,
		followFlock : false,
		// Instructions
		startText : "Click and drag.\nESC to view options.",
		optionText : "P: Pause.\nF: Fade colors over time.\nS: Enable Flocking.\nD: Draw Cells.\nG: Update grid cells.\nM: Increase update rate.\nN: Decrease update rate.\nC: Clear screen.\nR: Reset Cells.",
		textSize : 36,
		textAlpha : 1,
		drawOpenningText : true,
		drawMenu : false,
		menuOpen : false,

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

				// creating the grid
				app.grid = new cellGrid();
				console.log(app.grid);
				console.log('Dimensions:', w, h);

				// create the boids
				app.flockManager = new FlockManager();

				// create the font
				app.textFont = g.createFont("Brush Script MT", app.textSize);
				app.menuFont = g.createFont("Arial", app.textSize - 10);

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
						g.fill(0, 0, 0, 0.01);
						g.rect(0, 0, w, h);
					}

					// Fixed update intervals
					app.updateTimer += app.time.elapsed;
					if (app.updateTimer > app.updateRate) {
						app.updateTimer = 0;
						if (app.updateGrid) {
							console.log("update " + app.time.frames);
							app.grid.update(app.time);
						}
					}

					// draw the boids
					app.flockManager.update(app.time);
					app.flockManager.draw(g);

					// draw the cells
					if (app.drawCells) {
						app.grid.draw(g);
					}

					// draw any text or ui
					if (app.drawOpenningText && !app.menuOpen) {
						g.fill(0.8, 0.5, 0.5, app.textAlpha);
						g.textFont(app.textFont);
						g.textSize(app.textSize);
						g.textAlign(g.CENTER, g.CENTER);
						g.text(app.startText, app.dimensions.x / 2, app.dimensions.y / 2);
					}
					if (app.firstClick) {
						app.grid.drawSelected(g);
						if (!app.dragging && !app.menuOpen) {
							app.drawOpenningText = true;
						}
					}
					// draw the menu if ESC is clicked
					if (app.drawMenu) {
						g.fill(0, 0, 0.6, 0.1);						g.rect(app.dimensions.x / 2 - 210, app.dimensions.y / 2 - 150, 420, 300, 30);
						g.fill(0, 0, 0, app.textAlpha);
						g.textFont(app.menuFont);
						g.textSize(app.textSize);
						g.textAlign(g.CENTER, g.CENTER);
						g.text(app.optionText, app.dimensions.x / 2, app.dimensions.y / 2);
					}
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

			$("#app").mousemove(function(ev) {
				var x = ev.offsetX;
				var y = ev.offsetY;
				//console.log(x + " " + y);
				app.prevMouse.setTo(app.mouse.x, app.mouse.y);
				app.mouse.setTo(x, y);
				app.drawOpenningText = false;
			});

			// using the event helper
			$('#app').mousewheel(function(event) {

			});

			$('#app').mousedown(function(event) {
				app.mouseIsDown = true;
				app.grid.selectCell(app.prevMouse);
			});

			$('#app').mouseup(function(event) {
				app.mouseIsDown = false;
				app.grid.findInfluence();
				app.dragging = false;
				app.flockManager.spawnFlockAtCell(app.grid.selected);
				if (app.firstClick) {
					//app.clearBackground = true;
					app.firstClick = false;
					app.drawOpenningText = false;
					app.drawCells = true;
				}
			});

			$("#app").draggable({
				helper : function() {
					return $("<div id='dragPos'></div>");
				},

				drag : function(event, ui) {
					app.dragging = true;
					var x = $('#dragPos').offset().left;
					var y = $('#dragPos').offset().top;
					app.grid.expandCell(app.mouse);
					//console.log(x, y);
					app.drawOpenningText = false;
					// TODO:
					// test if you can find influence here without lagging
					// app.grid.findInfluence();
				}
			});

			$(document).keydown(function(e) {

				var key = String.fromCharCode(e.keyCode);
				console.log(key, e.keyCode);

				// escape key pressed
				if (e.keyCode == 27) {
					app.drawMenu = !app.drawMenu;
					app.menuOpen = !app.menuOpen;
				}

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
				case 'D':
					app.drawCells = !app.drawCells;
					break;
				case 'R':
					app.grid.reset();
					app.flockManager.reset();
					break;
				case 'G':
					app.updateGrid = !app.updateGrid;
					break;
				case 'S':
					app.followFlock = !app.followFlock;
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
