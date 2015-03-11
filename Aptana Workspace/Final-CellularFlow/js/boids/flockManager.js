/**
 * @author Leif
 */

define(["common", "./boidFlock"], function(common, boidFlock) {

	var FlockManager = Class.extend({
		init : function() {
			this.flocks = [];
		},

		update : function(time) {
			for (var i = 0; i < this.flocks.length; i++) {
				this.flocks[i].update(time);
			}
		},

		draw : function(g) {
			for (var i = 0; i < this.flocks.length; i++) {
				this.flocks[i].draw(g);
			}
		},

		spawnFlockAtCell : function(cell) {
			if (cell.size >= cell.SPAWN_SIZE && !cell.hasGivenBirth) {
				cell.hasGivenBirth = true;
				this.flocks[this.flocks.length] = new boidFlock(cell.position, cell.size, cell.color);
			}
		},
		
		reset : function() {
			this.flocks = [];
		},
	});

	return FlockManager;
});
