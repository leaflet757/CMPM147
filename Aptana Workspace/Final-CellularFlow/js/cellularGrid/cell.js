/**
 * @author Leif Myer
 */
define(["inheritance", "common"], function(_inheritance, common) {
	'use strict';

	var Cell = Class.extend({

		// Static Variables
		STATIC_SIZE : 3,
		SPAWN_SIZE : 30,

		init : function(x, y, row, col) {
			this.ROW_ID = row;
			this.COL_ID = col;
			this.children = [];
			this.color = new common.KColor(Math.abs(utilities.noise(x, y)), 0, 0.8, 0.1);
			this.drawCell = false;
			//this.color = new common.KColor(Math.abs(utilities.noise(x,y)), 0.5, 1, 0.1);
			this.position = new Vector(x, y);
			this.size = this.STATIC_SIZE;
			this.flow = new Vector(0, 0);
			this.hasGivenBirth = false;
		},

		expand : function(mousePos) {
			var newDist = mousePos.getDistanceToIgnoreZ(this.position);
			this.color.s = newDist / (200 - this.STATIC_SIZE);
			this.size = newDist;
			this.drawCell = true;
		},
		
		expandBySize : function(size) {
			this.color.s = size / (20 - this.STATIC_SIZE);
			this.size = size;
			this.drawCell = true;
		},

		reset : function() {
			this.size = this.STATIC_SIZE;
			this.removeChildren();
			this.hasGivenBirth = false;
		},

		update : function(time) {

		},

		draw : function(g) {
			//if (this.drawCell) {
			if (this.drawCell && this.size > this.STATIC_SIZE) {
				g.noStroke();
				this.color.fill(g);
				g.ellipse(this.position.x, this.position.y, this.size, this.size);
			}
		},

		addChild : function(cell) {
			cell.flow.add(this.findInfluenceVector(cell));
			cell.flow.normalize();
			//console.log(cell.ROW_ID, cell.COL_ID, cell.flow);
			this.children[this.children.length] = cell;
			this.drawCell = true;
		},

		removeChildren : function() {
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].removeFlow();
				//console.log(this.children[i].flow);
			}
			this.children = [];
			this.drawCell = false;
		},

		removeFlow : function() {
			this.flow.setTo(0, 0);
		},

		findInfluenceVector : function(cell) {
			var dist = cell.position.getDistanceToIgnoreZ(this.position);
			var y = this.size - dist;
			//console.log('vector influence', y);
			// TODO: might not be correct
			var vec = new Vector();
			vec.setToPolar(y, cell.position.getAngleTo(this.position));
			//console.log(vec);
			//var vec = new Vector(cell.position.x - this.position.x, this.position.y - cell.position.y);
			vec.normalize();
			//vec.mult(y);
			return vec;
		},
		/*
		copyFrom : function(other) {
			for (var i = 0 ; i < other.children.length; i++) {
				console.log(i, other.children[i]);
				this.children[i].copyFrom(other.children[i]);
			}
			this.color = other.color.clone();
			this.drawCell = other.drawCell;
			this.size = other.size;
			this.flow = other.flow.clone();
			this.hasGivenBirth = other.hasGivenBirth;
		}*/
	});

	return Cell;
});
