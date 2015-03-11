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
			this.flow = new Vector(0,0);
		},

		expand : function(mousePos) {
			var newDist = mousePos.getDistanceToIgnoreZ(this.position);
			this.color.s = newDist/(200-this.STATIC_SIZE);
			this.size = newDist;
		},

		reset : function() {
			this.size = this.STATIC_SIZE;
			this.removeChildren();
		},

		update : function(time) {

		},

		draw : function(g) {
			g.noStroke();
			this.color.fill(g);
			g.ellipse(this.position.x, this.position.y, this.size, this.size);
		},
		
		addChild : function(cell) {
			cell.flow.add(this.findInfluenceVector(cell));
			//console.log(cell.ROW_ID, cell.COL_ID, cell.flow);
			this.children[this.children.length] = cell;
		},
		
		removeChildren : function() {
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].flow.sub(this.findInfluenceVector(this.children[i]));
				//console.log(this.children[i].flow);
			}
			this.children = [];
		},
		
		findInfluenceVector : function(cell) {
			var dist = cell.position.getDistanceToIgnoreZ(this.position);
			var y = this.size - dist;
			console.log(y);
			// TODO: might not be correct
			//var vec = new Vector(cell.position.x - this.position.x, cell.position.y - this.position.y);
			var vec = new Vector(cell.position.x - this.position.x, this.position.y - cell.position.y);
			vec.normalize();
			vec.mult(y);
			return vec;
		}
	});

	return Cell;
});
