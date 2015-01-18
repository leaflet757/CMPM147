define(["inheritance", "common"], function(_inheritance, common) {'use strict';
    var Particle = Class.extend({
        init : function() {
			this.position = new Vector(Math.random() * 200 - 100, Math.random() * 200 - 100);
			//this.velocity = new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5);
			this.velocity = Vector.polar(100, Math.random()*2*Math.PI);
			// this.acceleration = new Vector(0, Math.random() * 2 * Math.PI);
			this.radius = Math.random() * 10 + 10;
        },

        // Figure out the forces on the particle, how to change the velocity, 
        // and then move it somewhere.  The Vector library has many functions that may be useful here
        update : function(time) {
			
			this.acceleration = new Vector(this.position);
			//this.acceleration.mult(-1);
			this.acceleration.setToDifference(app.mouse, this.position);
			
			
			this.velocity.addMultiple(this.acceleration, time.elapsed);
			this.position.addMultiple(this.velocity, time.elapsed);
			
        },


        // Draw the particle to the screen.  'g' is the processing drawing object
        //  You might use: 'g.ellipse(x, y, radiusW, radiusH)', or 'g.rect(x, y, radiusW, radiusH)'
        //  Remember to also set the fill and stroke, or remove them if you dont want them
        //  You could also use a 'for' loop to layer multiple ellipses for each particle
        //  Also, browse the Vector library for useful drawing functions that deal with vectors
        draw : function(g) {
			g.fill(0.8,1,1);
			g.noStroke();
			//g.ellipse(this.position.x, this.position.y, 15, 15);
			for (var i = 0; i < 5; i++)
			{
				var pct = i/5;
				var r = this.radius*(1-pct);
				g.fill(0, 1-pct, 1-pct);
				g.ellipse(this.position.x, this.position.y, r, r);
			}
			
			g.stroke(.2);
			//this.position.drawArrow(g, this.acceleration, 0.5);
			
        },
        
        // used for debugging 
        setVel: function(xvel,yvel)
        {
        	this.velocity = new Vector(xvel, yvel);
        },
    });
    
    var LineFollower = Class.extend({
        init : function(x,y,t) {
			this.position = new Vector(x,y);
			this.theta = t;
			this.radius = 5;
        },

        update : function(time) {
			this.theta = (this.theta + time.total * 0.3) % (2 * Math.PI);
			
			this.position = convertThetaToPentagram(this.theta);
			
        },

        draw : function(g) {
			g.fill(.6, 1,1);
			g.noStroke();
			g.ellipse(this.position.x, this.position.y, this.radius, this.radius);

        },
        
    });
    Particle.LineFollower = LineFollower;
    
    var ParticleFollower = Particle.extend({
    	
    	init : function(lineFollower) {
    		this.position = new Vector(lineFollower.position.x + Math.random() * 10 - 5, lineFollower.position.y + Math.random() * 10 - 5);
			//this.velocity = new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5);
			this.velocity = Vector.polar(8, Math.random()*2*Math.PI);
			// this.acceleration = new Vector(0, Math.random() * 2 * Math.PI);
			this.radius = Math.random() * 5 + 5;
			this.lineFollower = lineFollower;
        },

        update : function(time) {
			this.acceleration = new Vector(this.position);
			//this.acceleration.mult(-1);
			//this.acceleration.setToDifference(this.lineFollower.position, this.position);
			this.acceleration.setToDifference(this.lineFollower.position, this.position);
			
			this.velocity.addMultiple(this.acceleration, time.elapsed);
			this.position.addMultiple(this.velocity, time.elapsed);
			
        },

        draw : function(g) {
			g.fill(0.8,1,1);
			g.noStroke();
			//g.ellipse(this.position.x, this.position.y, 15, 15);
			for (var i = 0; i < 5; i++)
			{
				var pct = i/5;
				var r = this.radius*(1-pct);
				g.fill(0, 1-pct, 1-pct);
				g.ellipse(this.position.x, this.position.y, r, r);
			}
			
			g.stroke(.2);
			//this.position.drawArrow(g, this.acceleration, 0.5);

        },
        
    });
    Particle.ParticleFollower = ParticleFollower;

    return Particle;
});