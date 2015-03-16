/**
 * @author Kate
 * Edited by: Leif
 */

define(["common", "./boid"], function(common, Boid) {

	var BoidFlock = Class.extend({

		SPAWN_RATE : 20, // pixels per new boid

		init : function(startingPosition, cellSize, cellColor) {
			this.center = new Vector(startingPosition);
			this.boids = [];
			var totalBoids = 3 + Math.round((cellSize / this.SPAWN_RATE));
			// at minimum spawns 4
			var angleGap = (2 * Math.PI) / totalBoids;
			console.log(angleGap, totalBoids);
			var startingDirection = this.center.getAngleTo(app.mouse);
			var twist = Math.random() > 0.5 ? -Math.PI / 2 : Math.PI / 2;
			for (var i = 0; i < totalBoids; i++) {
				var start = i * angleGap + startingDirection;
				var finish = start + twist;
				this.boids[this.boids.length] = new Boid(this, startingPosition, start, finish, cellColor);
			}
			this.position = new Vector(startingPosition);
			this.targetPosition = new Vector();
			this.velocity = new Vector();
			this.findNewTarget();
			this.targetRadius = 30;
			this.neighborRange = 100;
		},

		findNewTarget : function() {
			this.targetPosition.setTo(Math.random() * (app.dimensions.x - 30) + 30, Math.random() * (app.dimensions.y - 30) + 30);
			this.velocity.setToPolar(50, this.targetPosition.getAngleTo(this.position));
		},

		update : function(time) {
			for (var i = 0; i < this.boids.length; i++) {
				this.boids[i].findNeighbors(this.boids);
				this.boids[i].updateForces(time);
				this.boids[i].updatePosition(time);
			}
			
			// update the flock position
			if (this.position.getDistanceToIgnoreZ(this.targetPosition) < this.targetRadius) {
				this.findNewTarget();
			}
			this.position.addMultiple(this.velocity, time.elapsed);
		},

		draw : function(g) {
			for (var i = 0; i < this.boids.length; i++) {
				this.boids[i].draw(g);
			}
			//g.fill(Math.random(), 1, 1);
			//g.noStroke();
			//g.ellipse(this.position.x, this.position.y, 10, 10);
		},

		getDistanceTo : function(target) {
			return target.getDistanceTo(this.center);
		},

		select : function() {
			this.isSelected = true;
		},

		deselect : function() {
			this.isSelected = false;
		},
	});

	return BoidFlock;
});
