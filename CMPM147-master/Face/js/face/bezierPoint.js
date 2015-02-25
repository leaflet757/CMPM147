/**
 * @author Kate Compton
 */
define(["common"], function(common) {'use strict';

    var BezierPoint = Vector.extend({

        init : function(x, y, r0, r1, theta) {
            this._super(x, y);

            this.cp0 = new Vector();
            this.cp1 = new Vector();
            this.r0 = r0;
            this.r1 = r1;
            this.theta0 = theta;
            this.theta1 = Math.PI + this.theta0;
            this.updateHandles();
        },

        updateHandles : function() {
            this.cp0.setToPolarOffset(this, this.r0, this.theta0);
            this.cp1.setToPolarOffset(this, this.r1, this.theta1);
        },

        setSharpHandles : function(r0, theta0, r1, theta1) {
            this.r0 = r0;
            this.r1 = r1;
            this.theta0 = theta0;
            this.theta1 = theta1;
            this.updateHandles();
        },

        draw : function(g) {
            g.strokeWeight(1);
            g.stroke(1, 0, 1, .5);
            this.drawLineTo(g, this.cp0);
            this.drawLineTo(g, this.cp1);
            g.noStroke();
            g.fill(.6, .4, 1);
            this.drawCircle(g, 5);
            g.fill(.8, 1, 1);
            this.cp0.drawCircle(g, 3);
            g.fill(.4, 1, 1);
            this.cp1.drawCircle(g, 3);
        },

        vertexTo : function(g, xMult) {
            g.vertex(this.x * xMult, this.y);
        },

        curveTo : function(g, xMult, previous) {
           
            if (previous == undefined && this.previous)
                previous = this.previous;

            if (!previous) {
                g.vertex(this.x * xMult, this.y);
            } else {
                var cp0 = previous.cp1;
                var cp1 = this.cp0;
                //g.vertex(this.x * xMult, this.y);
                g.bezierVertex(cp0.x * xMult, cp0.y, cp1.x * xMult, cp1.y, this.x * xMult, this.y);
            }
        }
    });
    return BezierPoint;
});
