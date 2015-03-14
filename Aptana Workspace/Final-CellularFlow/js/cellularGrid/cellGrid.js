/**
 * @author Leif Myer
 */
// NOTE: previous values are not all being updated

define(["inheritance", "common", "./cell"], function(_inheritance, common, cell) {
	'use strict';
	var CellGrid = Class.extend({

		// Static Variables
		cellSize : 30,
		selected : null,

		init : function() {
			this.columns = Math.round(app.dimensions.x / this.cellSize);
			this.rows = Math.round(app.dimensions.y / this.cellSize);
			this.xSpacing = app.dimensions.x / this.columns;
			this.ySpacing = app.dimensions.y / this.rows;
			console.log("Create grid cell size " + this.cellSize + ", " + this.columns + " x " + this.rows);

			this.values = [];
			this.lastValues = [];
			// only saves sizes
			this.cellsForUpdate = [];
			// stores which cells need to be updated

			for (var i = 0; i < this.columns; i++) {
				this.values[i] = [];
				this.lastValues[i] = [];
				for (var j = 0; j < this.rows; j++) {
					this.values[i][j] = this.createStartValueFor((i + 1) * this.xSpacing, (j + 1) * this.ySpacing, i, j);
					this.lastValues[i][j] = this.values[i][j].size;
				}
			}

		},

		createStartValueFor : function(x, y, r, c) {
			return new cell(x, y, r, c);
		},

		getLastValue : function(i, j) {
			if (i < 0 || j >= this.rows || j < 0 || i >= this.columns) {
				return 0;
			}
			return this.lastValues[i][j];
		},

		getValue : function(i, j) {
			if (i < 0 || j >= this.rows || j < 0 || i >= this.columns) {
				return undefined;
			}
			return this.values[i][j];
		},

		computeNextValue : function(i, j) {

		},

		// applies a transform to the grid
		applyToGrid : function(fxn) {
			for (var i = 0; i < this.columns; i++) {
				for (var j = 0; j < this.rows; j++) {
					fxn(i, j, this.values[i][j]);
				}
			}
		},

		selectCell : function(mousePos) {

			//this.selected = null;
			var aIndex = 0;
			var ascended = [];

			for (var i = 1; i < this.columns; i++) {
				for (var j = 1; j < this.rows; j++) {
					var val = this.values[i-1][j - 1];
					if (mousePos.x > i * this.xSpacing - this.xSpacing / 2 && mousePos.x < i * this.xSpacing + this.xSpacing / 2 && mousePos.y > j * this.ySpacing - this.ySpacing / 2 && mousePos.y < j * this.ySpacing + this.ySpacing / 2) {
						this.selected = val;
					}
					if (val.size > val.STATIC_SIZE) {
						ascended[aIndex++] = val;
					}
				}
			}

			// chcek to see if mouse is in larger cirlces
			for (var i = 0; i < aIndex; i++) {
				var distance = mousePos.getDistanceToIgnoreZ(ascended[i].position);
				if (distance < ascended[i].size) {
					this.selected = ascended[i];
				}
			}
		},

		drawSelected : function(g) {
			if (this.selected) {
				this.selected.draw(g);
			}
		},

		expandCell : function(mousePos) {
			if (this.selected != null) {
				this.selected.expand(mousePos);
			}
		},

		update : function(time) {
			// compute the next values
			for (var i = 0; i < this.cellsForUpdate.length; i++) {
				var node = this.cellsForUpdate[i];
				this.lastValues[node.ROW_ID][node.COL_ID] = node.size;
				var selectedTemp = this.selected;
				this.selected = node;
				//var neighbors = [this.getLastValue(node.ROW_ID + 1, node.COL_ID), this.getLastValue(node.ROW_ID - 1, node.COL_ID), this.getLastValue(node.ROW_ID, node.COL_ID - 1), this.getLastValue(node.ROW_ID, node.COL_ID + 1), this.getLastValue(node.ROW_ID + 1, node.COL_ID + 1), this.getLastValue(node.ROW_ID - 1, node.COL_ID - 1), this.getLastValue(node.ROW_ID - 1, node.COL_ID + 1), this.getLastValue(node.ROW_ID + 1, node.COL_ID - 1)];
				var neighbors = [this.getLastValue(node.ROW_ID + 1, node.COL_ID), this.getLastValue(node.ROW_ID - 1, node.COL_ID), this.getLastValue(node.ROW_ID, node.COL_ID - 1), this.getLastValue(node.ROW_ID, node.COL_ID + 1)];
				var list = [this.getValue(node.ROW_ID + 1, node.COL_ID), this.getValue(node.ROW_ID - 1, node.COL_ID), this.getValue(node.ROW_ID, node.COL_ID - 1), this.getValue(node.ROW_ID, node.COL_ID + 1)];
				var total = 0;
				for (var n = 0; n < neighbors.length; n++) {
					if (neighbors[n] > 2 *node.size) {
						total++;
						list[n].expandBySize(list[n].size - this.xSpacing/4);
					}
				}
				// this.selected.size = sum;
				this.selected.expandBySize(this.selected.size + total * this.xSpacing/4);
				//this.findInfluence();
				this.selected = selectedTemp;
				//console.log(node);
			}
			/* for (var i = 0; i < this.columns; i++) {
			for (var j = 0; j < this.rows; j++) {
			// save the last values
			this.lastValues[i][j] = this.values[i][j].size;
			// compute the next values
			this.computeNextValue(i, j);
			}
			} */

			// Do after-calculation stuff
			/*
			 if (this.postUpdate) {
			 for (var i = 0; i < this.columns; i++) {
			 for (var j = 0; j < this.rows; j++) {
			 this.postUpdate(i, j);
			 }
			 }
			 }
			 */
		},

		draw : function(g) {
			for (var i = 1; i < this.columns; i++) {
				for (var j = 1; j < this.rows; j++) {
					this.values[i-1][j - 1].draw(g);
				}
			}
		},

		reset : function() {
			console.log('reseting...');
			for (var i = 0; i < this.columns; i++) {
				for (var j = 0; j < this.rows; j++) {
					this.values[i][j].reset();
				}
			}
		},

		getCellFromPosition : function(position) {
			var theChosenOne;
			for (var i = 1; i < this.columns; i++) {
				for (var j = 1; j < this.rows; j++) {
					var val = this.values[i-1][j - 1];
					if (position.x > i * this.xSpacing - this.xSpacing / 2 && position.x < i * this.xSpacing + this.xSpacing / 2 && position.y > j * this.ySpacing - this.ySpacing / 2 && position.y < j * this.ySpacing + this.ySpacing / 2) {
						theChosenOne = val;
					}
				}
			}
			return theChosenOne;
		},

		findInfluence : function() {
			// remove previous influences and 'selected' update cells
			var tempUpdateCells = [];
			for (var n = 0; n < this.cellsForUpdate.length; n++) {
				var node = this.cellsForUpdate[n];
				var notInChildList = true;
				for (var p = 0; p < this.selected.children.length; p++) {
					var c = this.selected.children[p];
					if (c.ROW_ID == node.ROW_ID && c.COL_ID == node.COL_ID) {
						notInChildList = false;
						p = this.selected.children.length;
					}
				}
				if (notInChildList) {
					tempUpdateCells[tempUpdateCells.length] = node;
				}
			}
			//this.cellsForUpdate = [];
			this.cellsForUpdate = tempUpdateCells;

			this.selected.removeChildren();
			var cellAdded = false;
			// find the cells that will be effected
			var xInf = Math.round(this.selected.size / this.xSpacing);
			var yInf = Math.round(this.selected.size / this.ySpacing);
			var xLowerBound = Math.max(0, this.selected.ROW_ID - xInf);
			var xUpperBound = Math.min(this.selected.ROW_ID + xInf, this.columns - 1);
			var yLowerBound = Math.max(0, this.selected.COL_ID - yInf);
			var yUpperBound = Math.min(this.selected.COL_ID + yInf, this.rows - 1);
			//console.log(xLowerBound, xUpperBound, yLowerBound, yUpperBound, this.rows, this.columns);
			// console.log(this.selected.ROW_ID + xInf, this.rows);
			//	will be Inf +- ROWCOL ID
			//	for all cells c that are not the selected cell
			//		c.addInf(selected)
			for (var i = xLowerBound; i <= xUpperBound; i++) {
				for (var j = yLowerBound; j <= yUpperBound; j++) {
					var val = this.values[i][j];
					if (val != this.selected) {
						var distance = val.position.getDistanceToIgnoreZ(this.selected.position);
						// only effect cells that are unchanged
						//console.log('printing dist', distance);
						if (distance <= val.size + this.selected.size && val.size == val.STATIC_SIZE) {
							this.selected.addChild(val);
							//console.log('adding...', val.ROW_ID, val.COL_ID);
							// add child cell to update list
							this.cellsForUpdate[this.cellsForUpdate.length] = val;
							cellAdded = true;
						}
					}
				}
			}
			if (cellAdded) {
				// TODO: shrnk the cell by factor of 1
				this.cellsForUpdate[this.cellsForUpdate.length] = this.selected;
				//this.lastValues[this.selected.ROW_ID][this.selected.COL_ID] = this.selected.size;
				//this.selected.expandBySize(this.selected.size - xInf);
				//console.log('adding selected', this.selected.size, this.selected.ROW_ID, this.selected.COL_ID);
			}
			//console.log('selected', this.selected, 'updates', this.cellsForUpdate);
			//console.log('children', this.selected.children);
		}
	});

	return CellGrid;
});
