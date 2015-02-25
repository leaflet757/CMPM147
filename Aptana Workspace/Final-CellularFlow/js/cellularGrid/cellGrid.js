/**
 * @author Leif Myer
 */
define(["inheritance", "common"], function(_inheritance, common) {'use strict';
    var CellGrid = Class.extend({
	
		// Member Variables
		cellSize : 30,
		
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
			// TODO return cell obj
            return {};
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

        applyToGrid : function(fxn) {
            for (var i = 0; i < this.columns; i++) {
                for (var j = 0; j < this.rows; j++) {

                    fxn(i, j, this.values[i][j]);
                }
            }
        },

        update : function() {
            // Save the last values
            for (var i = 0; i < this.columns; i++) {
                for (var j = 0; j < this.rows; j++) {
                    this.lastValues[i][j] = this.values[i][j];
                }
            }
            // compute the next values
            for (var i = 0; i < this.columns; i++) {
                for (var j = 0; j < this.rows; j++) {
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

            g.noStroke();
            for (var i = 0; i < this.columns; i++) {
                for (var j = 0; j < this.rows; j++) {

                    this.drawCell(g, this.values[i][j], i * xSpacing, j * ySpacing, xSpacing, ySpacing);

                }
            }
        },

        drawCell : function(g, value, x, y, xSpacing, ySpacing) {
			// TODO: change to custom drawing
            g.fill(.5, .5, value);
            g.rect(x, y, xSpacing, ySpacing);
        }
    });
    
    return CellGrid;
});
