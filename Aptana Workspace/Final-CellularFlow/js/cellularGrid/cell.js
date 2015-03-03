/**
 * @author Leif Myer
 */
define(["inheritance", "common"], function(_inheritance, common) {
	'use strict';

	var Cell = Class.extend({

		// Member Variables
		STATIC_SIZE : 3,
		EXPANSION_RATE : 2,
		color : {},
		position : {},

		init : function(x, y) {
			this.color = new common.KColor(0, 1, 1);
			this.position = new Vector(x,y);
			this.size = this.STATIC_SIZE;
		},

		expand : function(prevMouse, mousePos) {
			var prevDist = prevMouse.getDistanceToIgnoreZ(this.position);
			var newDist = mousePos.getDistanceToIgnoreZ(this.position);
			if (newDist - prevDist > 0) {
				this.size += this.EXPANSION_RATE;
			}
			else {
				this.size -= this.EXPANSION_RATE;
			}
		},
		
		reset : function() {
			this.size = this.STATIC_SIZE;
		},

		update : function(time) {

		},

		draw : function(g, x, y) {
			g.noStroke();
			this.color.fill(g);
			g.ellipse(x, y, this.size, this.size);
		}
	});

	return Cell;
});
