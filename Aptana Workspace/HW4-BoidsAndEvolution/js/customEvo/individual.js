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

		},

		update : function(time) {
			// TODO Update the thing based on dna? on time?

		},

		draw : function(g) {
			// Move to the right square
			g.pushMatrix();

			this.center.translateTo(g);
			g.pushMatrix();
			g.fill(0, 0, 0, .4);
			g.rect(-this.boxSize / 2, -this.boxSize / 2, this.boxSize, this.boxSize);
			// Use this dna to draw something
			g.noStroke();
			// MORE HARD CODING POWER!!!!
			// Leg Segments
			var legCount = this.dna[0];
			var legSeg = this.dna[1];
			var center = new Vector(0, 0);
			
			
			
			// Move to HEad
			g.pushMatrix();
			var bodySeg = this.dna[3];
			var bodySize = 20;
			center.setTo(0, -bodySeg/3 * (bodySize*3/4)-20); // not quite accurate
			g.pushMatrix();
			center.translateTo(g);
			
			// Feeler 
			g.stroke(0);
			for (var i = 0; i < this.dna[10]; i++) {
				g.line(0,0,  20 - i*20/this.dna[10], -15 - 2*i);
				g.line(0,0,-20 + i*20/this.dna[10],-15 - 2*i);
			}
			g.popMatrix();
			
			// Head Draw
			center.translateTo(g);
			g.fill(this.dna[7], 0.4, 0.4);
			g.noStroke();
			//g.ellipse(0,0,10,10);
			g.beginShape();
			for (var n = 0; n < this.dna[6]; n++) {
				g.vertex(15*Math.sin(n*(2*Math.PI)/this.dna[6]), -15*Math.cos(n*(2*Math.PI)/this.dna[6]));
			}
			g.endShape();
			g.popMatrix();
			
			// Body Segments
			center.setTo(0, -bodySeg/3 * (bodySize*3/4));
			for (var i = 0; i < bodySeg; i++) {
				g.fill(this.dna[5], 1 - i/(2*bodySeg), 1- i/(2*bodySeg));
				center.translateTo(g);
				center.setTo(0,bodySize*3/4);
				g.beginShape();
				for (var n = 0; n < this.dna[4]; n++) {
					g.vertex(bodySize*Math.sin(n*(2*Math.PI)/this.dna[4]), -bodySize*Math.cos(n*(2*Math.PI)/this.dna[4]));
				}
				bodySize++;
				g.endShape();
			}
			
			// Wings
			g.popMatrix();
			center.setTo(-20,0);
			g.fill(0.53,1,1);
			g.pushMatrix();
			for(var i = 0; i < this.dna[11]; i++) {
				g.pushMatrix();
				g.rotate(-i*((Math.PI/2)/this.dna[11]));
				g.ellipse(center.x,center.y,20,8);
				g.popMatrix();
				g.pushMatrix();
				g.rotate(i*((Math.PI/2)/this.dna[11]));
				g.ellipse(-center.x,center.y,20,8);
				g.popMatrix();
			}
			g.popMatrix();
			
			// Eye Color
			g.pushMatrix();
			center.setTo(0, -(bodySize*3/4)); // not quite accurate
			center.translateTo(g);
			g.fill(this.dna[9], 1,0.2);
			for(var i = 0; i < this.dna[8]; i++) {
				g.pushMatrix();
				g.rotate(-i*((Math.PI/4)/this.dna[8]));
				g.ellipse(center.x,center.y,2,2);
				g.popMatrix();
				g.pushMatrix();
				g.rotate(i*((Math.PI/4)/this.dna[8]));
				g.ellipse(-center.x,center.y,2,2);
				g.popMatrix();
			}
			g.popMatrix();
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
