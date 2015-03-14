/**
 * @author Kate
 * Edited by: Leif
 */

define(["common", "../particles/particle"], function(common, Particle) {

	var boidCount = 0;

	var Boid = Particle.extend({

		// Member Variables
		INITIAL_SPEED : 100,

		// Particle Methods
		//============================================
		init : function(flock, position, startingDirection, finishDirection, cellColor) {
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
			this.color = new common.KColor(cellColor.h + Math.random() * 0.08 + 0.42, 1, 1, 0.1);
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
					var temp = this.velocity.lerp(cell.flow, .85 );
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

					if (d < this.neighbors.neighborRange)
						this.neighbors.push(allBoids[i]);
				}
			}
		},

		drawForces : function(g) {

		},
	});
	return Boid;

});
