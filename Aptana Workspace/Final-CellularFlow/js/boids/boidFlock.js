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

		},

		update : function(time) {
			for (var i = 0; i < this.boids.length; i++) {
				this.boids[i].updatePosition(time);
			}

		},

		draw : function(g) {
			for (var i = 0; i < this.boids.length; i++) {
				this.boids[i].draw(g);
			}

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
