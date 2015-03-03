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
			this.parents = [];
			this.color = new common.KColor(0, 0, 1, 0.1);
			this.position = new Vector(x, y);
			this.size = this.STATIC_SIZE;
		},

		expand : function(mousePos) {
			var newDist = mousePos.getDistanceToIgnoreZ(this.position);
			this.size = newDist;
		},

		reset : function() {
			this.size = this.STATIC_SIZE;
		},

		update : function(time) {

		},

		draw : function(g) {
			g.noStroke();
			// TODO: remove when correct
			if (this.parents.length == 0) {
				this.color.fill(g);
			}
			else {
				g.fill(0, 1, 1, 0.1);
			}
			g.ellipse(this.position.x, this.position.y, this.size, this.size);
		},
		
		addParent : function(cell) {
			this.parents[this.parents.length] = cell;
		},
		
		removeParents : function() {
			this.parents = [];
		},
		
		getParentInfluences : function() {
			for(var i = 0; i < this.parents.length; i++) {
				
			}
		},
	});

	return Cell;
});
