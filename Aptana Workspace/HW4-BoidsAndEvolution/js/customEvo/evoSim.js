/**
 * @author Kate
 */

define(["common", "../evo/evolution", "./individual"], function(common, Evolution, Individual) {

	function gaussRandom() {
		var r = 2 * (Math.random() - .5);
		r *= Math.random();
		return r;
	}

	var CustomEvo = Evolution.extend({
		init : function() {
			this.dnaSize = 12;
			this.populationSize = 15;
			this.offset = 0;
			this.last = 0;

			this._super();

			this.selectAt(new Vector(0, 0));
		},

		//==================================================

		// A thing you can modify
		// Is this the DNA you want?  Would you rather have an array, or an array of arrays? Or something else?
		createDNA : function() {
			var dna = [];
			// hard code FTW!!!
			dna[0] = randomEven(0,12); 		// [0,12] evens
			dna[1] = Math.round(Math.random() * 7 + 1); // [1,8]
			dna[2] = Math.random(); 		// [0,1]
			dna[3] = Math.round(Math.random() * 3 + 1); // [1,4]
			dna[4] = Math.round(Math.random() * 6); 	// enum [0,6]
			dna[5] = Math.random(); 		// [0,1]
			dna[6] = Math.round(Math.random() * 6); 	// enum [0,6]
			dna[7] = Math.random(); 		// [0,1]
			dna[8] = Math.round(Math.random() * 7 + 1); // [1,8]
			dna[9] = Math.random(); 		// [0,1]
			dna[10] = randomEven(0,6); 		// [0,6] evens
			dna[11] = randomEven(0,4); 		// [0,4] evens

			return dna;
		},

		// A way to turn the thing you can modify
		//  into the thing you can judge, modify the individual.js file
		instantiate : function(dna, index) {

			var obj = new Individual(dna, index);
			return obj;
		},

		// Draw all the individuals (a way to judge the thing)
		draw : function(g) {
			this._super(g);
		},

		// Select the thing at the target (for picking with mouse interaction)
		selectAt : function(target) {
			this._super(target);
			//console.log(this.selected);

			if (this.selected) {
				this.spawnFromSelected();
			}
		},

		// Helpers
		// If you change the DNA, you should also be able to change
		cloneDNA : function(dna) {
			var clone = [];
			for (var i = 0; i < dna.length; i++) {
				clone[i] = dna[i];
			}
			return clone;
		},

		// Is this the DNA you want?  Would you rather have an array, or an array of arrays? Or something else?
		modifyDNA : function(dna, amt) {
			if (Math.random() > .5) {
				dna[0] = randomEven(0,12); 		// [0,12] evens
				dna[1] = Math.round(Math.random() * 7 + 1); // [1,8]
				dna[2] = Math.random(); 		// [0,1]
				dna[3] = Math.round(Math.random() * 3 + 1); // [1,4]
				dna[4] = Math.round(Math.random() * 6); 	// enum [0,6]
				dna[5] = Math.random(); 		// [0,1]
				dna[6] = Math.round(Math.random() * 6); 	// enum [0,6]
				dna[7] = Math.random(); 		// [0,1]
				dna[8] = Math.round(Math.random() * 7 + 1); // [1,8]
				dna[9] = Math.random(); 		// [0,1]
				dna[10] = randomEven(0,6); 		// [0,6] evens
				dna[11] = randomEven(0,4); 		// [0,4] evens
			}
		},

		// Update all the simulations
		update : function(time) {
			this._super(time);

		},
	});
	return CustomEvo;

});

function randomEven(min, max) {
	var number = Math.round(Math.random() * (max - min) + min);
	while ((number % 2) != 0) {
		number = Math.round(Math.random() * (max - min) + min);
	}
	//console.log(number);
	return number;
}
