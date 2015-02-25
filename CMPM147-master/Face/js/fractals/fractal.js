/**
 * @author Kate
 */

define(["common", "graph/graph"], function(common, Graph) {
    var graphCount = 0;
    // Make some custom fractals
    var Dragon = Graph.extend({

        init : function() {
            this._super();

            this.id = graphCount;
            graphCount++;
            this.hue = -this.id * .0034 * this.id + 2.8;

            this.iterations = 0;

            // Create the dragon starting points
            var r = 120;
            var p = Vector.polar(320 * Math.random(), 20 * Math.random());
            p.x *= 1.2;
            var p0 = new Graph.Node(p);
            p.addPolar(320 * Math.random(), 20 * Math.random());
			//p.addPolar(320, 20)
            p.x *= 1.2;
            var p1 = new Graph.Node(p);

            this.addNode(p0);
            this.addNode(p1);

            var edge = this.connect(p0, p1);
            edge.group = -1;
            edge.side = 1;
            console.log(edge);
            var length = edge.getLength();
            var iterations = Math.floor(2 * Math.log(length));

            for (var i = 0; i < iterations; i++) {
                this.cleanup();
                this.iterate();
            }
        },

        iterate : function() {
            // Go through all the edges, and make an offset vertex in the middle

            for (var i = 0; i < this.edges.length; i++) {

                var edge = this.edges[i];
                if (edge.group === this.iterations - 1) {
                    var m = edge.getLength()// * Math.sin(edge.length * i * 0.2);
					//console.log(m);
					//var n = edge.getLength() * Math.cos(edge.length * i * 0.2);
                    m = edge.side * m / 2;
					//n = edge.side * n/2;

                    var midpoint = this.createEdgeNode(edge, 0.5, m);
					//var midpoint2 = this.createEdgeNode(edge, .5, n);
                    var newEdges = this.splitEdge(edge, [midpoint], false);

                    for (var j = 0; j < newEdges.length; j++) {

                        // Flip the side
                        newEdges[j].side = edge.side * -1;
                        newEdges[j].side = 1;
                        if (j % 2 === 1)
                            newEdges[j].side *= -1;

                        // Set the group and group color for the new edges
                        newEdges[j].group = this.iterations;
                        var gr = this.iterations;
                        newEdges[j].testColor = new common.KColor((this.hue - gr * .012) % 1, (.4 + .5 * Math.random()) * (1 - gr * .06), 1, -.2 + gr * .26);
                    }
                }
            }
            this.iterations++;

            // console.log(this.edges.join(","));
            this.cleanup();
        },

        draw : function(g) {
            g.noStroke();
            g.fill((this.hue) % 1, 1, .1 + .6 * Math.random(), .4);
            for (var i = 0; i < this.nodes.length; i++) {

                g.ellipse(this.nodes[i].x, this.nodes[i].y, 7, 7);

            }

            for (var i = 0; i < this.edges.length; i++) {
                this.edges[i].draw(g, 0, 20);
            }
        }
    });

    var Terrain = Graph.extend({

        init : function(i) {
            this._super();

            this.id = graphCount;
            graphCount++;

            this.iterations = 0;

            var r = Math.pow(i, 1.1) * 100 + 600;
            var h = 13 * Math.pow(i, 1.5) - 200;
            var p0 = new Graph.Node(new Vector(-r, h, 0));
            var p1 = new Graph.Node(new Vector(r, h, 0));

            this.addNode(p0);
            this.addNode(p1);

            var edge = this.connect(p0, p1);
            edge.group = -1;

            var iterations = 10;
            this.cleanup();
            for (var i = 0; i < iterations; i++) {
                this.iterate();
                this.cleanup();
            }

        },

        iterate : function() {
            // Go through all the edges, and make an offset vertex in the middle
            console.log("terrain iterate");

            for (var i = 0; i < this.edges.length; i++) {

                var edge = this.edges[i];
                if (edge.group === this.iterations - 1) {

                    var m = edge.getLength();
                    //m *= .10 * Math.sin(i * 200 + this.id) * Math.pow(this.iterations, .7);
					var n = m;
					m *= .5 * Math.sin(i * 200 + this.id);
					n *= 0.5 * Math.cos(i * 200 + this.id);
					//m *= 0.7;
                    
					var midpoint = this.createEdgeNode(edge, 0.33, m);
					var midpoint2 = this.createEdgeNode(edge, 0.66, n);
                    var newEdges = this.splitEdge(edge, [midpoint, midpoint2], false);

                    for (var j = 0; j < newEdges.length; j++) {
                        newEdges[j].group = this.iterations;
                    }
                }
            }
            this.iterations++;

            // console.log(this.edges.join(","));
            this.cleanup();
        },

        draw : function(g) {
            g.noStroke();
            g.fill(0);
            for (var i = 0; i < this.nodes.length; i++) {

                // / g.ellipse(this.nodes[i].x, this.nodes[i].y, 7, 7);

            }

            for (var i = 0; i < this.edges.length; i++) {
                var e = this.edges[i];
                g.strokeWeight(40 / Math.pow(e.group + 1, 1.5));
                g.stroke((Math.sin(this.id) * .12 + 1.1) % 1, e.group * .28 + .2, 1 - e.group * .12, .05 + .018 * Math.pow(e.group, 1.4));
                g.line(e.start.x, e.start.y, e.end.x, e.end.y);

                //this.edges[i].draw(g, 0, 20);
            }
        }
    });

    var Tree = Graph.extend({
        init : function() {
            this._super();
            this.iterations = 0;
            var p = new Vector(0, 300);
            var p0 = new Graph.Node(p);
            p.y -= 200;
            var p1 = new Graph.Node(p);

            this.addNode(p0);
            this.addNode(p1);

            var edge = this.connect(p0, p1);
            edge.group = -1;

            this.cleanup();
            for (var i = 0; i < 5; i++) {
                this.iterate();
                this.cleanup();

            }
        },

        iterate : function() {
            // Go through all the edges, and make an offset vertex in the middle
            console.log("terrain iterate");

            for (var i = 0; i < this.edges.length; i++) {

                var edge = this.edges[i];
                if (edge.group === this.iterations - 1) {
                    console.log("Branch");
                    // create branches
                    var dTheta = 0.5;
                    var len = edge.getLength();
                    var theta = edge.offset.getAngle();
                    var p0 = Vector.polarOffset(edge.end, len * (.6 + .2 * Math.random()), theta - dTheta);
                    var p1 = Vector.polarOffset(edge.end, len * (.6 + .2 * Math.random()), theta + dTheta);
                    var left = new Graph.Node(p0);
                    var right = new Graph.Node(p1);
                    this.addNode(left);
                    this.addNode(right);
                    var e0 = this.connect(edge.end, left);
                    var e1 = this.connect(edge.end, right);
                    e0.group = this.iterations;
                    e1.group = this.iterations;
                }
            }

            this.iterations++;
        },
    });

    return {
        Dragon : Dragon,
        Terrain : Terrain,
        Tree : Tree,
    };

});
