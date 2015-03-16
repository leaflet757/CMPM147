var app = {
    currentExpansions : []
};

define(["common", "./thrones/thronesWorld", "processing", "./tracery/tracery"], function(common, world, processing, _tracery) {
    'use strict';

    $.extend(app, {

        init : function() {

            // A little time object to keep track of the current time,
            //   how long its been since the last frame we drew,
            //   and how long the app has been running
            app.time = {
                date : Date.now(),
                start : Date.now(),
                total : 0,
                elapsed : .1,
                frames : 0,
                updateTime : function() {
                    var last = this.date;
                    this.date = Date.now();
                    this.total = (this.date - this.start) / 1000;
                    this.elapsed = (this.date - last) / 1000;

                    if (this.elapsed < .01)
                        this.elapsed = .01;
                    if (this.elapsed > .1)
                        this.elapsed = .1;

                    this.frames++;

                }
            };

            app.canvasDimensions = new Vector();

            app.initUI();

            var actionOutput = $("#actionOutput");
            app.actionLog = function(s) {
                actionOutput.append(s);

                var height = actionOutput[0].scrollHeight;
                actionOutput.scrollTop(height);
            };

            console.log("asp");

            var canvas = $("#world");

            world.start();

            var processingInstance = new Processing(canvas.get(0), function(g) {

                // Set the size of processing so that it matches that size of the canvas element
                var w = canvas.width();
                var h = canvas.height();
                app.canvasDimensions.setTo(w, h);

                g.size(w, h);
                g.colorMode(g.HSB, 1);
                g.ellipseMode(g.CENTER_RADIUS);

                g.draw = function() {
                    app.time.updateTime();
                    g.background(.55, .67, .6);
                    g.pushMatrix();
                    g.translate(g.width / 2, g.height / 2);
                    if (app.world)
                        app.world.draw(g);

                    g.popMatrix();
                };
            });
        },

        initUI : function() {

            $(document).keydown(function(e) {

                var key = String.fromCharCode(e.keyCode);
                var vizWindow = $("#visualization");
                switch(key) {
                case ' ':
                    app.vizEnabled = !app.vizEnabled;
                    if (app.vizEnabled) {
                        vizWindow.html("");
                        vizWindow.show();

                        app.plugins.expansionview.createTree(app.currentExpansions[0], vizWindow);

                    } else
                        vizWindow.hide();
                    return false;
                    break;
                case '1':
                    break;
                case '2':
                    break;
                case '3':
                    break;
                }

            });

            $(document).keyup(function(e) {
                app.key = undefined;
            });
        },
    });
});
