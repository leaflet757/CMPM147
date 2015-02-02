/**
 * @author Kate Compton
 */

define(["common", "./grids/grid", "./particles/particle"], function(common, Grid, Particle) {
	'use strict';

	// Make a population of sheep
	var ExampleAutomata = Grid.extend({
		cellSize : 20,

		createStartValueFor : function(x, y) {
			var grassAmt = .5 + .45 * utilities.noise(x * .06, y * .06);
			grassAmt = utilities.sCurve(grassAmt, 2);
			var waterAmt = .17 + -1 * Math.abs(utilities.noise(x * .02, y * .02 + 30));
			waterAmt = Math.max(0, waterAmt);

			var sheepAmt = Math.floor(6 * Math.max(0, utilities.noise(x * .1, y * .16) - .36));

			if (waterAmt > 0)
				sheepAmt = 0;

			return {
				grass : grassAmt,
				water : waterAmt,
				sheep : sheepAmt,
				sheepOutboundTo : [],
			};
		},

		computeNextValue : function(x, y) {
			var last = this.getLastValue(x, y);

			// Create a new set of values
			var next = {
				grass : last.grass,
				water : last.water,
				sheep : last.sheep,
				sheepOutboundTo : [],
			};

			// Get the last value, and the last values of any neighbors

			var neighbors = [this.getLastValue(x + 1, y), this.getLastValue(x - 1, y), this.getLastValue(x, y - 1), this.getLastValue(x, y + 1)];

			// sheep eats some grass
			next.grass = Math.max(0, next.grass + -.1 * last.sheep);

			// Get the average of my neighbors grass
			var neighborGrass = 0;
			for (var i = 0; i < neighbors.length; i++) {
				// how much greener is the grass?
				var dGrass = next.grass - neighbors[i].grass;
				neighborGrass += neighbors[i].grass;
			}

			// regrow grass if there is neighboring grass
			neighborGrass /= 4;
			if (next.grass < neighborGrass)
				next.grass += .02;

			// limit grass to between 0 and 1
			next.grass = Math.max(0, Math.min(next.grass, 1));

			// all sheep make decisions
			var count = last.sheep;
			for (var i = 0; i < count; i++) {
				// Pick a direction randomly
				var dir = Math.floor(Math.random() * 5);
				if (dir < 4) {

					// Is there water?
					if (neighbors[dir].water <= 0) {
						// remove the sheep from this area
						next.sheep--;
						// add to the outbound sheep list
						next.sheepOutboundTo.push(dir);
					}
				}
			}

			return next;
		},

		// Do something after all the cells have updated
		postUpdate : function(x, y) {
			var current = this.getValue(x, y);
			var neighbors = [this.getValue(x + 1, y), this.getValue(x - 1, y), this.getValue(x, y - 1), this.getValue(x, y + 1)];
			// where did all the sheep go?
			for (var i = 0; i < current.sheepOutboundTo.length; i++) {
				neighbors[current.sheepOutboundTo[i]].sheep++;
			}
		},

		// Custom drawing
		drawCell : function(g, value, x, y, width, height) {
			// grass color
			g.fill(.1 + .3 * value.grass, 1, .3 + .7 * value.grass);
			if (value.water > 0)
				g.fill(.5 + .2 * value.water, 1 - value.water * .7, .4 - .8 * value.water);
			g.rect(x, y, width, height);

			// Draw sheep, how many?
			for (var i = 0; i < value.sheep; i++) {
				var r = .2 * width * Math.pow(i, .7);
				var theta = 2.1 * Math.pow(i, .7);
				g.pushMatrix();
				g.translate(r * Math.cos(theta) + x + width / 2, r * Math.sin(theta) + y + height / 2);
				g.fill(0, 0, 0, .4);
				g.ellipse(0, 4, 7, 2);

				g.fill(1);
				g.ellipse(0, 0, 4, 4);
				g.fill(0);
				g.ellipse(3, 0, 3, 3);

				g.popMatrix();

			}

		}
	});

	//======================================================
	var GameOfLife = Grid.extend({
		cellSize : 20,

		// Create a starting value for the x y cell
		// This could be an integer, floating point value, or an object
		createStartValueFor : function(x, y) {
			return Math.random();
		},

		// Compute the next value for this cell.
		// You will probably want to look at the previous values of surrounding cells
		computeNextValue : function(x, y) {
			// TODO replace this with code that creates a Conways Game of Life simulation

			// Blurring
			// Get the last value, and the last values of any neighbors
			var v = this.getLastValue(x, y);
			// last value of current cell
			var neighbors = [this.getLastValue(x + 1, y), this.getLastValue(x - 1, y), this.getLastValue(x, y - 1), this.getLastValue(x, y + 1), this.getLastValue(x + 1, y + 1), this.getLastValue(x - 1, y - 1), this.getLastValue(x - 1, y + 1), this.getLastValue(x + 1, y - 1)];

			var liveNeighbors = 0;
			var deadNeighors = 0;

			for (var i = 0; i < neighbors.length; i++) {
				if (neighbors[i] == 1) {
					liveNeighbors++;
				} else {
					deadNeighors++;
				}
			}

			if (v == 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
				return 0;
			} else if (v == 0 && liveNeighbors == 3) {
				return 1;
			} else if (v == 1 && (liveNeighbors == 2 || liveNeighbors == 3)) {
				return 1;
			}
			return 0;
		},

		// Custom drawing
		drawCell : function(g, value, x, y, width, height) {
			g.fill(.2, 1, value);
			g.rect(x, y, width, height);
		},
	});

	//======================================================
	// Cellular Automata
	var CustomAutomata = Grid.extend({
		cellSize : 20,

		// Create a starting value for the x y cell
		// This could be an integer, floating point value, or an object
		createStartValueFor : function(x, y) {
			return Math.random();
		},

		// Compute the next value for this cell.
		// You will probably want to look at the previous values of surrounding cells
		computeNextValue : function(x, y) {
			// TODO replace this with code that creates a Conways Game of Life simulation

			// Blurring
			// Get the last value, and the last values of any neighbors
			var v = this.getLastValue(x, y);
			var v0 = this.getLastValue(x + 1, y);
			var v1 = this.getLastValue(x - 1, y);
			var v2 = this.getLastValue(x, y - 1);
			var v3 = this.getLastValue(x, y + 1);

			return utilities.lerp((v0 + v1 + v2 + v3) / 4, v, .1);
		},

		// Custom drawing
		drawCell : function(g, value, x, y, width, height) {
			g.fill(.9, 1, value);
			g.rect(x, y, width, height);
		},
	});

	var CustomVoronoi = Grid.Voronoi.extend({
		createRegions : function() {
			console.log("Create regions");
			this.regions = [];
			this.particles = [];
			this.regionSize = [];
			this.firstUpdate = true;

			// TODO Spawn points in an interesting way, and set a color for each region

			for (var i = 0; i < 1000; i++) {

				var color = new common.KColor((i * .023) % 1, .5 + .5 * utilities.noise(i * .02 + 5), 1);
				var center = new Vector(utilities.noise(i * .06) * 400 + 400, 300 * utilities.noise(.06 * i + 30) + 300);
				//var venter

				var region = new Grid.Voronoi.Region(center, color);
				this.regions[i] = region;
			}

		},

		drawRegion : function(g, region) {

			// TODO Find an interesting way to draw the voronoi diagram
			//  Open up the object, what is inside?

			if (region.edges) {
				// Draw the region as triangles

				// this.regionSize = [];
				// var largestSize = -999999;
				//
				// for (var i = 0; i < region.edges.length; i++) {
				// // g.noStroke();
				// // region.idColor.fill(g, .3 * Math.sin(i));
				// // g.beginShape();
				// var v0 = region.edges[i].end;
				// var v1 = region.edges[i].start;
				// var v2 = region;
				// this.regionSize[i] = v0.getDistanceToIgnoreZ(v1);
				// this.regionSize[i + 1] = v1.getDistanceToIgnoreZ(v2);
				// //regionSize[i] = (v0.getDistanceToIgnoreZ(v1) + v1.getDistanceToIgnoreZ(v2)) / 2;
				// // g.vertex(v0.x, v0.y);
				// // g.vertex(v1.x, v1.y);
				// // g.vertex(v2.x, v2.y);
				// // g.endShape(g.CLOSE);
				// }
				//
				// //Draw the region as a single shape
				// // region.idColor.stroke(g, -.4, 1);
				// // g.strokeWeight(3);
				// // g.noFill();
				// // g.beginShape();
				// // for (var i = 0; i < region.edges.length; i++) {
				// // var v = region.edges[i].start;
				// // g.vertex(v.x, v.y);
				// // }
				// // g.endShape(g.CLOSE);
				//
				// g.noStroke();
				// for (var i = 0; i < region.edges.length; i++) {
				// region.idColor.fill(g, .3 * Math.sin(i));
				// var v = region;
				// var size = 1 / 50 * this.regionSize[i] * this.regionSize[i + 1];
				// //console.log(regionSize[i]);
				// g.ellipse(v.x, v.y, size, size);
				// //g.ellipse(v.x,v.y,regionSize[i], regionSize[i]);
				// }

				var largestSize = -999999;

				for (var i = 0; i < region.edges.length; i++) {
					var v0 = region.edges[i].end;
					var v1 = region.edges[i].start;
					var v2 = region;
					this.regionSize[i] = v0.getDistanceToIgnoreZ(v1);
					this.regionSize[i + 1] = v1.getDistanceToIgnoreZ(v2);
					var size = 1 / 50 * this.regionSize[i] * this.regionSize[i + 1];
					if (size > largestSize) {
						largestSize = size;
					}
					this.particles[i] = new Particle.VoronoiParticle(region, size);
				}

				for (var i = 0; i < this.particles.length; i++) {
					//this.particles[i].shrinkSize(largestSize);
				}

				for (var i = 0; i < this.particles.length; i++) {
					this.particles[i].update(app.time);
					region.idColor.fill(g, .3 * Math.sin(i));
					this.particles[i].draw(g);
				}

			}

			// draw quad edges
			/*
			 if (this.edges) {
			 for (var i = 0; i < this.edges.length; i++) {
			 this.edges[i].draw(g);
			 }
			 }
			 */
		},
	});

	return {
		ExampleAutomata : ExampleAutomata,
		CustomAutomata : CustomAutomata,
		GameOfLife : GameOfLife,
		CustomVoronoi : CustomVoronoi,
	};
});
