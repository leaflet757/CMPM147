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

			for (var i = 0; i < this.columns; i++) {
				this.values[i] = [];
				this.lastValues[i] = [];
				for (var j = 0; j < this.rows; j++) {
					this.values[i][j] = this.createStartValueFor((i + 1) * this.xSpacing, (j + 1) * this.ySpacing, i, j);
					this.lastValues[i][j] = this.createStartValueFor((i + 1) * this.xSpacing, (j + 1) * this.ySpacing, i, j);
				}
			}

		},

		createStartValueFor : function(x, y, r, c) {
			return new cell(x, y, r, c);
		},

		getLastValue : function(i, j) {
			var rows = this.rows;
			var cols = this.columns;
			var iWrap = ((i % cols) + cols) % cols;
			var jWrap = ((j % rows) + rows) % rows;
			return this.lastValues[iWrap][jWrap];
		},

		getValue : function(i, j) {
			var rows = this.rows;
			var cols = this.columns;
			var iWrap = ((i % cols) + cols) % cols;
			var jWrap = ((j % rows) + rows) % rows;
			return this.values[iWrap][jWrap];
		},

		computeNextValue : function(i, j) {
			// TODO: leave unimplemented for now

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

		expandCell : function(mousePos) {
			if (this.selected != null) {
				this.selected.expand(mousePos);
			}
		},

		update : function(time) {
			// compute the next values
			for (var i = 0; i < this.columns; i++) {
				for (var j = 0; j < this.rows; j++) {
					// save the last values
					this.lastValues[i][j] = this.values[i][j];
					// compute the next values
					this.computeNextValue(i, j);
				}
			}

			// Do after-calculation stuff
			if (this.postUpdate) {
				for (var i = 0; i < this.columns; i++) {
					for (var j = 0; j < this.rows; j++) {
						this.postUpdate(i, j);
					}
				}
			}

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

		findInfluence : function() {
			// remove previous influences
			this.selected.removeParents();
			// find the cells that will be effected
			var xInf = Math.round(this.selected.size / this.xSpacing);
			var yInf = Math.round(this.selected.size / this.ySpacing);
			var xLowerBound = Math.max(0, this.selected.ROW_ID - xInf);
			var xUpperBound = Math.max(this.selected.ROW_ID + xInf, this.selected.ROW_ID);
			var yLowerBound = Math.max(0, this.selected.COL_ID - yInf);
			var yUpperBound = Math.max(this.selected.COL_ID + yInf, this.selected.COL_ID);
			console.log(xLowerBound, xUpperBound, yLowerBound, xUpperBound);
			//	will be Inf +- ROWCOL ID
			//	for all cells c that are not the selected cell
			//		c.addInf(selected)
			for (var i = xLowerBound; i <= xUpperBound; i++) {
				for (var j = yLowerBound; j <= yUpperBound; j++) {
					var val = this.values[i][j];
					if (val != this.selected) {
						var distance = val.position.getDistanceToIgnoreZ(this.selected.position);
						// only effect cells that are unchanged
						// TODO: should parents effect larger cells?
						if (distance <= val.size + this.selected.size && val.size == val.STATIC_SIZE) {
							val.addParent(this.selected);
						}
					}
				}
			}
		}
	});

	return CellGrid;
});
