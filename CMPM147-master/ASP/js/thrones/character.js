/**
 * @author Kate
 */

define(["common", "../world/worldObj"], function(common, WorldObj) {
    var charCount = 0;
    var charHolder = $("#characterHolder");
    var Character = WorldObj.extend({
        init : function(parent, name, settings) {
            this._super(parent, name, {});

            for (var key in settings) {
                if (settings.hasOwnProperty(key)) {
                    this.createProp(key, settings[key]);
                }
            };

            this.createProp("isAt", "nowhere");

            app.world.characters.push(this);

            this.createDiv(charHolder);
            this.pos = new Vector();
            if (!this.isAt) {
                this.moveTo(app.world.places[Math.floor(Math.random() * 10)]);
            }

            console.log(this.name + " is at " + this.isAt);

            this.id = charCount;
            charCount++;
            this.idColor = common.KColor.makeIDColor(this.id);
        },

        moveTo : function(place) {
            var div = $("<div/>", {
                html : this.name + " moves to ",
            });
            div.append(place.makeSpan());

            app.actionLog(div);
            this.props.isAt.value = place.name;

            this.pos.setToPolarOffset(place.pos, 16, Math.random() * 100);
            this.div.css({
                transform : this.pos.toCSSTranslate()
            });
        },

        draw : function(g) {

        },

        // Handle new_ prop
        changeProp : function(prop, val) {
            if (prop === 'isAt') {
                this.moveTo(app.world.objs[val]);
            }
        },

        // Set prop, do something custom?
        setProp : function(propName, value) {
            var changed = this._super(propName, value);
            if (changed)
                console.log(this.name + " changed " + propName + " to " + value);
        },

        createDiv : function(holder) {
            this.iconDiv = $("<img/>", {
                class : "characterIcon",
                src : "css/images/icons/" + this.name + ".gif"
            });

            this.nameDiv = $("<div/>", {
                class : "characterName",
                html : this.name
            });

            this.div = $("<div/>", {
                class : "character",

            });

            this.div.append(this.iconDiv);
            this.div.append(this.nameDiv);
            holder.append(this.div);
        }
    });

    return Character;
});
