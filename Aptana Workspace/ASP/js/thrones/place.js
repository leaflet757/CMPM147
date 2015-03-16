/**
 * @author Kate
 */

define(["common", "../world/worldObj"], function(common, WorldObj) {
    var placeCount = 0;
    var Place = WorldObj.extend({
        init : function(parent, name, settings) {

            this._super(parent, name, settings);
            app.world.places.push(this);
            this.id = placeCount;
            placeCount++;
            this.idColor = common.KColor.makeIDColor(this.id);
            this.connectedTo = [];
        },

        getRandomDest : function() {
            return this.connectedTo[Math.floor(this.connectedTo.length * Math.random())];
        },

        makeSpan : function() {
            var span = $("<span/>", {
                html : this.name
            });
            span.css({
                color : this.idColor.toCSS()
            });
            return span;
        },

        draw : function(g) {
            g.noStroke();
            this.idColor.fill(g, -.3);
            this.pos.drawCircle(g, 3);
            this.idColor.fill(g, 1);
            this.pos.drawText(g, this.name, 5, 5);
        }
    });

    return Place;
});
