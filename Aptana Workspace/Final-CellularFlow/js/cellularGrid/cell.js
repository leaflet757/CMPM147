/**
 * @author Leif Myer
 */
define(["inheritance", "common"], function(_inheritance, common) {
	'use strict';

	var Cell = Class.extend({

		// Member Variables
		size : 3,
		color : {},

		init : function() {
			this.color = new common.KColor(0, 1, 1);

		},

		expand : function(factor) {
			if (factor > 0) {
				this.size += 3;
			} else {
				this.size -= 3;
			}
		},

		update : function(time) {

		},

		draw : function(g, x, y) {
			this.color.fill(g);
			g.ellipse(x, y, this.size, this.size);
		}
	});

	return Cell;
});
