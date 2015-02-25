/**
 * @author Kate Compton
 */
define(["common", "./bezierPoint"], function(common, BezierPoint) {'use strict';
    var drawBall = function(g, center, radius, color, layers, shadeStart, dshade) {
        for (var i = 0; i < layers + 1; i++) {
            var pct = i / layers;
            g.noStroke();
            color.fill(g, shadeStart + pct * dshade, 0);
            center.drawCircle(g, radius * Math.pow(1 - pct, .5));
        }
    };

    var Lid = Class.extend({
        init : function(eye, yMult) {

        },

        draw : function() {
            this.eye.face.color.fill(g, -2, 1);

            g.beginShape();

        }
    });

    var Eye = Class.extend({
        init : function(face) {
            this.face = face;
            this.size = face.eyeSize;
            this.tilt = -.1;

            this.center = new Vector(this.face.interocular, this.face.eyeLine);

            this.inner = new BezierPoint(-this.size, 0, this.size * .8, this.size * .8, 0);
            this.outer = new BezierPoint(this.size, 0, this.size * .8, this.size * .8, 0);

            var browH = -this.size * 2;
            this.browInner = new BezierPoint(-this.size, browH, this.size * .8, this.size * .8, browH);
            this.browOuter = new BezierPoint(this.size, browH, this.size * .8, this.size * .8, browH);

            this.irisCenter = new Vector();
            this.irisColor = new common.KColor(Math.random(), 1, .5);
            this.update();
        },

        update : function() {
            var t = app.time.total;
            var noise = utilities.noise;

            var open = utilities.sCurve(Math.abs(noise(t * .8) * .5 + .5), 3);

            this.open = Math.max(2 * open - .1, 0);
            this.lowerInnerTheta = .4 * noise(t + 10) + .3;
            this.lowerOuterTheta = Math.PI - (.4 * noise(t + 20) + .3);

            this.upperInnerTheta = this.lowerInnerTheta - this.open;
            this.upperOuterTheta = this.lowerOuterTheta + this.open;
            this.inner.theta0 = this.lowerInnerTheta;
            this.outer.theta1 = this.lowerOuterTheta;
            this.inner.theta1 = this.upperInnerTheta;
            this.outer.theta0 = this.upperOuterTheta;
            this.inner.updateHandles();
            this.outer.updateHandles();

            this.browInner.theta0 = noise(t + 30) + .3;
            this.browOuter.theta1 = noise(t + 20) + .3 + Math.PI;
            this.browInner.updateHandles();
            this.browOuter.updateHandles();

        },

        draw : function(g, xMult) {
            var faceColor = this.face.color;
            g.pushMatrix();
            g.scale(xMult, 1);

            var layers = 5;
            g.pushMatrix();
            this.center.translateTo(g);
            g.rotate(this.tilt);

            // line
            g.stroke(0);
            g.line(-this.size * 1.2, 0, this.size * 1.3, 0);

            // white
            g.fill(1, 0, 1, .3);
            g.ellipse(0, 0, this.size, this.size * .8);

            drawBall(g, this.irisCenter, this.size * .7, this.irisColor, 6, -.4, 1);

            // upper back
            //g.noStroke();
            g.stroke(0);
            faceColor.fill(g, -.3);
            g.beginShape();
            this.inner.vertexTo(g, 1);
            this.outer.curveTo(g, 1, this.inner);
            this.browOuter.curveTo(g, 1);
            this.browInner.curveTo(g, 1, this.browInner);
            g.endShape();

            // lower back
            g.noStroke();
            faceColor.fill(g, -.3);

            g.beginShape();
            this.outer.vertexTo(g, 1);
            this.inner.curveTo(g, 1, this.outer);
            var sides = 12;
            for (var i = 0; i < sides; i++) {
                var r = this.size;
                var theta = -Math.PI * i / sides + Math.PI;
                g.vertex(r * Math.cos(theta), r * Math.sin(theta));
            }

            g.endShape();

            // liner
            g.stroke(0);
            g.strokeWeight(4);
            g.noFill();
            g.beginShape();
            this.inner.vertexTo(g, 1);
            this.outer.curveTo(g, 1, this.inner);
            g.endShape();

            this.browInner.draw(g);

            this.browOuter.draw(g);

            g.popMatrix();
            g.popMatrix();
        },
    });
    return Eye;
});
