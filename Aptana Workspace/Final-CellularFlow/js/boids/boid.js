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
		init : function(position, startingDirection) {
			this._super();
			//console.log('boid spawned');
			
			this.setTo(position);
			this.velocity.setToPolar(this.INITIAL_SPEED, startingDirection);
			this.color = new common.KColor(0, 1, 0.5, 0.5); 
		},
		
		draw : function(g) {
			this.color.fill(g);
			g.ellipse(this.x, this.y, 10,10);
		},

		updateForces : function(time) {
			
		},
		
		updatePosition : function(time) {
			this._super(time);
			
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
