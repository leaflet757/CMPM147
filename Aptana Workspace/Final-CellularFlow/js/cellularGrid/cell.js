/**
 * @author Leif Myer
 */
define(["inheritance", "common"], function(_inheritance, common) {
	'use strict';

	var Cell = Class.extend({

		// Static Variables
		STATIC_SIZE : 3,

		init : function(x, y, row, col) {
			this.ROW_ID = row;
			this.COL_ID = col;
			this.children = [];
			this.color = new common.KColor(Math.abs(utilities.noise(x,y)), 0, 0.5, 0.1);
			//this.color = new common.KColor(Math.abs(utilities.noise(x,y)), 0.5, 1, 0.1);
			this.position = new Vector(x, y);
			this.size = this.STATIC_SIZE;
		},

		expand : function(mousePos) {
			var newDist = mousePos.getDistanceToIgnoreZ(this.position);
			this.color.s = newDist/(200-this.STATIC_SIZE);
			this.size = newDist;
		},

		reset : function() {
			this.size = this.STATIC_SIZE;
		},

		update : function(time) {

		},

		draw : function(g) {
			g.noStroke();
			this.color.fill(g);
			g.ellipse(this.position.x, this.position.y, this.size, this.size);
		},
		
		addChild : function(cell) {
			this.children[this.children.length] = cell;
		},
		
		removeChildren : function() {
			this.children = [];
		},
		
		influenceChildren : function() {
			for(var i = 0; i < this.children.length; i++) {
				
			}
		},
	});

	return Cell;
});
