/**
 * @author Kate
 */

define(["common", "graph/graph"], function(common, Graph) {
    var SPREAD = 9;
    var ID_ANGLE = 1;
    var ANGLE_SKEW = 3;
    var ANIM_ANGLE = 2;
    var SHRINKAGE = 4;
    var BUSHINESS = 5;
    var HUE_START = 7;
    var HUE_DIFF = 6;
    var FLOWER_HUE = 8;
    var FLOWER_COUNT = 0;
    var GROW_FACTOR = 10;
    var BRANCH_FACTOR = 11;
    var SHAPE_SIZE = 12;
    var SHAPE_COLOR = 13;
    var SHAPE_POINTS = 14;

    var LENGTH_VARIATION = 6;

    var graphCount = 0;
    // Make some custom fractals

    var TreeNode = Graph.Node.extend({
        init : function(parent, childPct) {
            this._super();
            this.parent = parent;
            this.depth = 0;
            this.timer = 0;

            // No children yet
            this.children = [];
            this.childPct = childPct;

            if (this.parent) {
                this.setParent();
            }

            // No offset to start
            this.angle = this.baseAngle;

            // Make a color for this node
            this.idColor = new common.KColor((3 + this.dna[HUE_START] + this.dna[HUE_DIFF] * this.depth) % 1, 1, .1 + .1 * this.depth);
            // set the time each should grow
            this.dna[GROW_FACTOR] = 500;
            this.dna[BRANCH_FACTOR] = Math.round(Math.abs(this.dna[BRANCH_FACTOR]) * 10);
			this.dna[SHAPE_SIZE] = Math.abs(this.dna[SHAPE_SIZE] * 10000);
			//this.dna[SHAPE_COLOR] = Math.abs(this.dna[SHAPE_COLOR]);
			this.dna[SHAPE_POINTS] = Math.round(Math.abs(this.dna[SHAPE_POINTS]));
        },

        setParent : function() {

            this.dna = this.parent.dna;

            this.depth = this.parent.depth + 1;

            // Add to the parent's list of children
            this.childIndex = this.parent.children.length;
            this.parent.children.push(this);

            // As a child, offset the child index
            var skew = Math.pow(this.dna[ANGLE_SKEW] - .5, 3);
            var spread = (1.5 * this.dna[BUSHINESS]);
            this.baseAngle = this.parent.angle + spread * (this.childPct - .5) + skew;

            // Set the position relative to the parent
            var mult = 15 - 12 * this.dna[BUSHINESS];
            this.branchLength = mult * this.parent.radius;

            // Add a variance in length
            this.branchLength *= (.8 + .3 * (Math.random() - .4) * LENGTH_VARIATION);
            this.radius = this.parent.radius * (.6 + .3 * this.dna[SHRINKAGE]);

            this.setToPolarOffset(this.parent, this.branchLength, this.baseAngle);

        },

        createChild : function(pct, graph) {
            var child = new TreeNode(this, pct);

            graph.addNode(child);
            graph.connect(this, child);
        },

        update : function() {
            // Set the position relative to the parent
            if (this.parent) {
                this.angleOffset = .1 * (1.2 + this.depth) * Math.sin(2 * app.time.total + this.depth);

                // Offset self
                this.angleOffset += .2 * Math.sin(this.id);

                this.angle = this.baseAngle + this.angleOffset;

                this.setToPolarOffset(this.parent, this.branchLength, this.angle);
            }

            // Update self, then update children
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].update();
            }



            this.timer++;
            // spawn more children if its time
            if (this.dna[GROW_FACTOR] < this.timer) {

            	this.timer = 0;
            }
        },

        draw : function(g) {
            g.noStroke();
            this.idColor.fill(g);
            this.drawCircle(g, this.radius);

            if (this.children.length === 0) {
                g.pushMatrix();
                this.translateTo(g);
                g.rotate(this.angle);

                var flowerCount = Math.round(8 * this.dna[FLOWER_COUNT]);

                // Draw some flowers?  What kind?
                for (var i = 0; i < flowerCount; i++) {

                    g.fill(this.dna[FLOWER_HUE], 1, 1, .7);
                    g.rotate(Math.PI * 2 / flowerCount);
                    var petalSize = 3 * this.radius;
                    g.ellipse(petalSize * 1.2, 0, petalSize, petalSize * .5);
                }
                
                
                	 g.fill(this.dna[SHAPE_COLOR], 1, 1, .7);
                	g.ellipse(0,0,this.dna[SHAPE_SIZE] * 100,this.dna[SHAPE_SIZE] * 100)
                	//console.log(this.dna[SHAPE_SIZE])
                

                g.popMatrix();

            }
        },

        getColor : function() {
            return this.idColor;
        }
    });

    // A root node is a special case of a tree node
    var RootNode = TreeNode.extend({
        init : function(dna, pos, angle, radius) {
            this.dna = dna;
            this._super();

            this.setTo(pos);
            this.radius = radius;

            this.angle = angle;
            this.depth = 0;
        }
    });

    var Tree = Graph.extend({
        init : function(rootPos, dna) {
            this._super();
            this.iterations = 0;

            // Create a root node
            this.root = new RootNode(dna, rootPos, -Math.PI / 2, 5 + Math.random() * 4);

            this.addNode(this.root);

            this.cleanup();
            for (var i = 0; i < 4; i++) {
                this.iterate();
                this.cleanup();

            }

        },

        iterate : function() {
            this.cleanup();

            // Take all the current nodes
            for (var i = 0; i < this.nodes.length; i++) {
                // Any children?
                var n = this.nodes[i];

                if (n.children.length === 0 && n.radius > 2) {
                    // Create children
                    var branches = 2;
                    for (var j = 0; j < branches; j++) {
                        n.createChild((j + .5) / branches, this);

                    }

                }

            }

            this.cleanup();
            this.iterations++;
        },

        update : function() {
            this.root.update();
        },

        draw : function(g) {

            for (var i = 0; i < this.edges.length; i++) {
                var e = this.edges[i];
                var angle = e.getAngle();
                var m = e.getLength();
                var r0 = e.start.radius;
                var r1 = e.end.radius;
                g.pushMatrix();

                e.start.translateTo(g);
                g.rotate(angle);
                //  g.rect(0, 0, m, 4);

                e.start.getColor().fill(g, 0, 0);
                g.beginShape();
                g.vertex(0, -r0);
                g.vertex(0, r0);
                g.vertex(m, r1);
                g.vertex(m, -r1);
                g.endShape();
                g.popMatrix();
            }

            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].draw(g);
            }
        }
    });

    return {
        createLTree : function(root) {
            var dna = [];

            // Create random DNA
            for (var i = 0; i < 20; i++) {
                dna[i] = Math.sin(50 * Math.random()) * .5 + .5;

            }
            return new Tree(root, dna);
        }
    };

});
