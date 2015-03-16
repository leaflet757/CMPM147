/**
 * @author Kate
 */

define(["common"], function(common) {
    var roomCount = 0;

    var Wall = Class.extend({
        init : function(start, end, left, right) {

        }
    });

    var Room = Class.extend({
        init : function(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.id = roomCount;
            this.idColor = common.KColor.makeIDColor(this.id);
            roomCount++;
        },

        getConnectingWall : function(r) {
            var top = Math.max(this.y, r.y);
            var bottom = Math.min(this.y + h, r.y + r.h);

            // right wall
            if (this.x + this.w === r.x) {
                return new Wall(new Vector(r.x, top), new Vector(r.x, bottom));
            }

            // left wall
            if (this.x === r.x + r.w) {

            }

        },

        subdivide : function(mansion) {
            // return two new rooms
            if (this.w * this.h > 160 + Math.random() * 400) {
                this.deleted = true;
                var split = (.3 + .4 * Math.random());
                if (this.w > this.h) {
                    var w1 = Math.round(this.w * split);
                    mansion.addRoom(new Room(this.x, this.y, w1, this.h));
                    mansion.addRoom(new Room(this.x + w1, this.y, this.w - w1, this.h));
                } else {
                    var h1 = Math.round(this.h * split);
                    mansion.addRoom(new Room(this.x, this.y, this.w, h1));
                    mansion.addRoom(new Room(this.x, this.y + h1, this.w, this.h - h1));
                }
            }

        },

        draw : function(g) {
            var border = 3;
            this.idColor.stroke(g);
            this.idColor.fill(g, .3, -.2);
            g.rect(this.x + border, this.y + border, this.w - border * 2, this.h - border * 2);
        }
    });

    // Create a mansion
    var Mansion = Class.extend({
        init : function(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.rooms = [new Room(x, y, w, h)];
            this.toAdd = [];
            for (var i = 0; i < 4; i++) {
                this.subdivide();
            }
            
            for (var i = 0; i < this.rooms.length; i++) {
                for (var j =  i + 1; j< this.rooms.length; j++) {
                
            }
  
            }

        },

        cleanup : function() {
            this.rooms = this.rooms.filter(function(room) {
                return !room.deleted;
            });

            this.rooms = this.rooms.concat(this.toAdd);
            this.toAdd = [];
        },

        addRoom : function(room) {
            this.toAdd.push(room);
        },

        subdivide : function() {
            for (var i = 0; i < this.rooms.length; i++) {
                this.rooms[i].subdivide(this);
            }
            this.cleanup();
        },
        draw : function(g) {
            g.fill(0, 0, 0);
            for (var i = 0; i < this.rooms.length; i++) {
                this.rooms[i].draw(g);
            }
        }
    });

    return Mansion;

});
