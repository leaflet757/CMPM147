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
			this.color = new common.KColor(cellColor.h + Math.random() * 0.08 + 0.42, 1, 1, 0.1);
		},

		draw : function(g) {
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
