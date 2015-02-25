/**
 * @author Kate Compton
 */
define(["common", "./bezierPoint", "./eye"], function(common, BezierPoint, Eye) {'use strict';
    // a set of corners
    // read from an image, then deform back to a rectangle

    var Face = Class.extend({
        init : function() {
            var face = this;
            this.color = new common.KColor(.65, .8, .6);

            var headSize = 260;
            this.eyeLine = headSize * -.1;
            this.eyeSize = headSize * .16;
            this.interocular = headSize * .35;

            this.sides = [{
                name : "left",
                xMult : -1,
            }, {
                name : "right",
                xMult : 1,
            }];

            this.sides.forEach(function(side) {
                side.headVerts = [];
                var topH = -headSize;
                var chinH = headSize;
                var cheekH = headSize * .2;
                var cheekW = headSize * .8;

                var top = new BezierPoint(0, topH, 0, headSize * .6, Math.PI);
                var cheek = new BezierPoint(cheekW, cheekH, headSize * .4, headSize * .4, -.45 * Math.PI);
                var chin = new BezierPoint(0, chinH, headSize * .34, 0, 0);

                side.headVerts.push(top);
                side.headVerts.push(cheek);
                side.headVerts.push(chin);
                cheek.previous = top;
                chin.previous = cheek;

                side.eye = new Eye(face);
            });
        },

        update : function() {
            this.sides.forEach(function(side) {
                side.eye.update();
            });
        },

        draw : function(g) {
            var faceColor = this.color;

            this.sides.forEach(function(side) {
                faceColor.fill(g, -.2, 1);
                faceColor.stroke(g, .3, 1);
                g.strokeWeight();
                g.beginShape();
                for (var i = 0; i < side.headVerts.length; i++) {
                    side.headVerts[i].curveTo(g, side.xMult);
                }
                g.endShape();

                for (var i = 0; i < side.headVerts.length; i++) {
                    side.headVerts[i].draw(g, side.xMult);
                }

                side.eye.draw(g, side.xMult);
            });

        },
    });

    return Face;
});
