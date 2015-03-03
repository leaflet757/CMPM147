/**
 * @author Leif Myer
 */
define(["inheritance", "common"], function(_inheritance, common) {
	'use strict';

	var Cell = Class.extend({

		// Member Variables
		STATIC_SIZE : 3,
		size : 3,
		color : {},
		position : {},

		init : function(x, y) {
			this.color = new common.KColor(0, 1, 1);
			this.position = new Vector(x,y);
		},

		expand : function(factor) {
			if (factor > 0) {
				this.size += 2;
			} else {
				this.size -= 2;
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
