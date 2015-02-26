/**
 * @author Leif Myer
 */
define(["inheritance", "common", "./cell"], function(_inheritance, common, cell) {
	'use strict';
	var CellGrid = Class.extend({

		// Member Variables
		cellSize : 30,
		selected : null,

		init : function() {
			this.columns = Math.round(app.dimensions.x / this.cellSize);
			this.rows = Math.round(app.dimensions.y / this.cellSize);
			console.log("Create grid cell size " + this.cellSize + ", " + this.columns + " x " + this.rows);

			this.values = [];
			this.lastValues = [];

			for (var i = 0; i < this.columns; i++) {
				this.values[i] = [];
				this.lastValues[i] = [];
				for (var j = 0; j < this.rows; j++) {

					this.values[i][j] = this.createStartValueFor(i, j);
					this.lastValues[i][j] = this.createStartValueFor(i, j);
				}
			}

		},

		createStartValueFor : function(i, j) {
			return new cell();
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

		selectCell : function(mousePos, dimensions) {
			var xSpacing = dimensions.x / this.columns;
			var ySpacing = dimensions.y / this.rows;

			for (var i = 1; i < this.columns; i++) {
				for (var j = 1; j < this.rows; j++) {
					if (mousePos.x > i * xSpacing - xSpacing/2 && mousePos.x < i * xSpacing + xSpacing/2 && mousePos.y > j * ySpacing - ySpacing/2 && mousePos.y < j * ySpacing + ySpacing/2) {
						this.selected = this.values[i-1][j - 1];
					}
				}
			}
		},

		expandCell : function(dragx, dragy) {
			if (this.selected != null) {
				this.selected.expand(dragx);
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
			var xSpacing = g.width / this.columns;
			var ySpacing = g.height / this.rows;

			for (var i = 1; i < this.columns; i++) {
				for (var j = 1; j < this.rows; j++) {
					this.drawCell(g, this.values[i-1][j - 1], i * xSpacing, j * ySpacing, xSpacing, ySpacing);
				}
			}
		},

		drawCell : function(g, value, x, y, xSpacing, ySpacing) {
			g.fill(.5, .5, 1);
			//g.rect(x - xSpacing / 2, y - ySpacing / 2, xSpacing, ySpacing);
			value.draw(g, x, y);
		}
	});

	return CellGrid;
});
