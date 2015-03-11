/**
 * @author Kate
 * Edited by: Leif
 */

define(["common", "../particles/particle"], function(common, Particle) {

	var boidCount = 0;

	var Boid = Particle.extend({
		
		// Member Variables
		INITIAL_SPEED : 50,
		
		// Particle Methods
		//============================================
		init : function(position, startingDirection, cellColor) {
			this._super();
			//console.log('boid spawned');
			
			this.setTo(position);
			this.acceleration = new Vector(this);
			this.velocity.setToPolar(this.INITIAL_SPEED, startingDirection);
			//this.color = cellColor.clone();
			//this.color.h = (this.color.h + Math.random() * 0.08 + 0.42) % 1;
			this.color = new common.KColor(cellColor.h + Math.random() * 0.08 + 0.42, 1,1, 0.2);
		},
		
		draw : function(g) {
			this.color.fill(g);
			g.ellipse(this.x, this.y, 10,10);
		},

		updateForces : function(time) {
			
		},
		
		updatePosition : function(time) {
			this._super(time);			this.acceleration.setToDifference(app.mouse, this);
			
			
			this.velocity.addMultiple(this.acceleration, time.elapsed);
			this.velocity.normalize();
			this.velocity.mult(this.INITIAL_SPEED);
			this.addMultiple(this.velocity, time.elapsed);
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
