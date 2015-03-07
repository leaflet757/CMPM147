/**
 * @author Kate
 */

define(["common"], function(common) {

	var Individual = Class.extend({
		init : function(dna, index) {
			this.dna = dna;
			this.index = index;
			this.boxSize = 140;

			// line them up in rows

			this.center = new Vector((index % 5) * 150 - 300, Math.floor(index / 5) * 150 - 200);
			console.log(index + ": " + this.center);

			// MAybe use this dna to make something
			this.segmentShape = {
				square : 0,
				circle : 1,
				trapezoid : 2,
				oval : 3,
				rectangle : 4,
				triangle : 5,
			};

		},

		update : function(time) {
			// TODO Update the thing based on dna? on time?

		},

		draw : function(g) {
			// Move to the right square
			g.pushMatrix();

			this.center.translateTo(g);

			g.fill(0, 0, 0, .4);
			g.rect(-this.boxSize / 2, -this.boxSize / 2, this.boxSize, this.boxSize);
			// Use this dna to draw something
			g.noStroke();
			// MORE HARD CODING POWER!!!!
			// Leg Color
			var legHue = this.dna[2];
			// Legs
			var legCount = this.dna[0];
			// Leg Segments
			var legSeg = this.dna[1];
			//console.log(legSeg);
			var center = new Vector(0, 0);
			for (var i = 0; i < legSeg; i++) {
				g.fill(legHue, 1, i / (legSeg - 1));
				//g.rotate(segPosForAngle.getAngleTo(this.center));
				//g.ellipse(segPos.x, segPos.y, segLength, 2);
				// other side
			}
			// Body Color

			// Body Shape

			// Body Segments

			// Head Color

			// Head Shape

			// Eye Color

			// Eye Count

			// Feeler Count

			// Wing Count

			g.popMatrix();
		},

		// Is this being clicked on?
		getDistanceTo : function(target) {
			return this.center.getDistanceTo(target);
		},

		select : function() {
			this.isSelected = true;
		},

		deselect : function() {
			this.isSelected = false;
		},
	});

	return Individual;
});
