/**
 * @author Kate
 * Edited by: Leif
 */

define(["common", "../particles/particle"], function(common, Particle) {

	var boidCount = 0;
	var forceNames = ["separation", "cohesion", "alignment", "border"];

	var Boid = Particle.extend({

		// Member Variables
		INITIAL_SPEED : 100,

		// Particle Methods
		//============================================
		init : function(flock, position, startingDirection, finishDirection, cellColor) {
			boidCount++;
			this._super();
			//console.log('boid spawned');
			this.flock = flock;
			this.setTo(position);
			//this.acceleration = new Vector(this);
			this.velocity.setToPolar(this.INITIAL_SPEED, startingDirection);
			this.twistTime = 3;
			this.lerpVec = new Vector();
			this.lerpVec.setToPolar(this.INITIAL_SPEED, finishDirection);
			this.color = cellColor.clone();
			this.color.h = (this.color.h + Math.random() * 0.08 + 0.42) % 1;
			this.strokeColor = this.color.clone();
			this.strokeColor.h = (this.strokeColor.h + Math.random() * 0.08 + 0.42) % 1;
			this.flockCenter = new Vector();
			this.color = new common.KColor(cellColor.h + Math.random() * 0.08 + 0.42, 1, 1, 0.1);
			for (var i = 0; i < forceNames.length; i++) {
				this.forces[forceNames[i]] = new Vector(0, 0);
				//console.log(forceNames[i], this.forces[forceNames[i]])
			}
		},

		draw : function(g) {

			var rgb = this.strokeColor.toRGB();
			g.stroke(this.strokeColor.h, this.strokeColor.s, this.strokeColor.b);
			//g.stroke(rgb[0], rgb[1], rgb[2]);
			g.strokeWeight(0.3);
			this.color.fill(g);
			g.ellipse(this.x, this.y, 10, 10);
		},

		updateForces : function(time) {
			// console.log('updating forces');
			this.totalForce.mult(0);
			if (app.followFlock) {
				//this._super(time);
				// drag
				//this.velocity.mult(.985);
				// reset the forces
				for (var i = 0; i < forceNames.length; i++) {
					this.forces[forceNames[i]].mult(0);
				}

				// This bird is flapping its wings to move forward in the direction that it is pointed
				//var speedBoost = 20 * this.flock.speedVariance * Math.sin(this.id * 5 + time.total);
				//this.forces.flapping.setToPolar(30 + speedBoost, this.rotation);

				// Set the cohesion force
				// Get the average position of the flock
				if (this.neighbors.length > 0) {
					// Where is everyone?  Average their positions
					this.flockCenter.mult(0);

					// Where is everyone going?
					// Average everyone's direction together.
					// This works best by adding vectors (turn their direction into a vector with Vector.polar),
					// just adding angles doesn't often work the way you think it should! (but try it to see why)
					this.flockTarget = this.flock.targetPosition;
					var count = 0;
					for (var i = 0; i < this.neighbors.length; i++) {

						if (this.neighbors[i] !== this) {
							count++;
							var neighbor = this.neighbors[i];

							// Is anyone too close?
							var factor = 1;
							var d = neighbor.getDistanceTo(this);
							var range = 20;
							if (d < range) {
								// TODO: Do something to push this boid away from its neighbor
								// add ...something to this.forces.separation
								factor = 10;
								//console.log('too close');
							}

							// Modify the flock center and the flock target
							// this.flockCenter.add(neighbor);
							// where is everyone, and what direction are they moving?
							this.forces.separation.setTo(this.forces.separation.x + factor * (neighbor.x - this.x), this.forces.separation.y + factor * (neighbor.y - this.y));
							this.forces.cohesion.add(neighbor);
							this.forces.alignment.add(neighbor.velocity);

						}
					}

					// // You will probably need to divide by the number of neighbors that you added up
					// //  then use flockCenter and flockTarget to do something to the cohesion and alignment forces
					if (count > 0) {
						// this.flockCenter.div(count);
						this.forces.cohesion.div(count);
						this.forces.alignment.div(count);
						this.forces.separation.div(count);
					}
					//console.log(this.forces.cohesion);
					this.forces.cohesion.setTo(this.forces.cohesion.x - this.x, this.forces.cohesion.y - this.y);
					//console.log('yes', this.forces.cohesion);
					this.forces.cohesion.normalize();
					this.forces.alignment.normalize();
					this.forces.separation.mult(-1);
					this.forces.separation.normalize();
					//console.log(this.forces);
					// multiply forces to make them feel right
					//this.forces.alignment.mult(3);
					//this.forces.cohesion.mult(3);
					//this.forces.separation.mult(3);

				}

				// BORDER FORCE
				// Move to the center if it gets too far off
				this.forces.border.mult(0);
				var d = this.getDistanceToIgnoreZ(this.flockTarget);
				var range = app.dimensions.y * 2/3;
				if (d > range) {
					var distOutsideOfRange = d - range;
					//this.forces.border.addMultiple(this, .2 * Math.pow(distOutsideOfRange, 1.22) / d);
					this.forces.border.add(this.flockTarget);
					this.forces.border.normalize();
					this.forces.border.mult(1);
					//console.log('outofrange', d);
				}

				for (var i = 0; i < forceNames.length; i++) {
					this.totalForce.add(this.forces[forceNames[i]]);
				}
			}
		},

		updatePosition : function(time) {
			this._super(time);

			// check to see if boid is off screen
			if (this.x > app.dimensions.x || this.x < 0 || this.y > app.dimensions.y || this.y < 0) {
				this.setTo(app.dimensions.x - this.x, app.dimensions.y - this.y);
			}
			// check to see if we need to add a little twist
			if (this.twistTime > 0) {
				this.velocity.setTo(this.velocity.lerp(this.lerpVec, 0.01));
				this.twistTime -= time.elapsed;
			}
			// otherwise check to see if the boid should be affected by any cells
			else {
				var cell = app.grid.getCellFromPosition(this);
				//console.log(cell);
				if (cell != undefined && cell.flow.x != 0 && cell.flow.y != 0) {
					var dist = this.getDistanceToIgnoreZ(cell.position);
					var temp = this.velocity.lerp(cell.flow, .85);
					//console.log(cell.flow, temp); // - dist / (4 *cell.size)
					this.velocity.setTo(temp);
					//this.velocity.add(cell.flow);
					this.velocity.normalize();
					this.velocity.mult(this.INITIAL_SPEED);
				}
			}

		},

		// Boid Methods
		//============================================
		findNeighbors : function(allBoids) {
			this.neighbors = [];

			for (var i = 0; i < allBoids.length; i++) {
				if (allBoids[i] !== this) {

					var d = allBoids[i].getDistanceTo(this);
					if (d < this.flock.neighborRange)
						this.neighbors.push(allBoids[i]);
				}
			}
		},

		drawForces : function(g) {

		},
	});
	return Boid;

});
