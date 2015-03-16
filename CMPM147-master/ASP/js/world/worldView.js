/**
 * @author Kate
 */
define(["common", "react"], function(common, React) {
    'use strict';
    var PropView = React.createClass({
        render : function() {
            var prop = this.props.prop;
            return React.DOM.div({
                className : "propView",
                onClick : function() {
                    console.log("Clicked " + obj.name);
                    return false;
                }
            }, React.DOM.span({
                className : "propTitle",

            }, prop.name + ":"), React.DOM.span({
                className : "propValue",

            }, prop.value));
        }
    });

    var ObjView = React.createClass({
        render : function() {
            var obj = this.props.obj;

            // create objects
            var subViews = [];

            obj.applyToObjs(function(sub, name) {
                console.log(name);

                subViews.push(ObjView({
                    obj : sub
                }));
            });

            obj.applyToProps(function(sub, name) {
         
                subViews.push(PropView({
                    prop : sub
                }));
            });

            var title = React.DOM.div({
                className : "title"

            }, obj.name);

            return React.DOM.div({
                className : "objectView",
                onClick : function() {
                    console.log("Clicked " + obj.name);
                    return false;
                }
            }, title, subViews);
        },
    });

    var WorldView = React.createClass({
        render : function() {
            var world = this.props.world;
            var charViews,
                placeViews;

            if (world.characters && world.places) {
                charViews = world.characters.map(function(c) {
                    return ObjView({
                        obj : c
                    });
                });

                placeViews = world.places.map(function(p) {
                    return ObjView({
                        obj : p
                    });
                });
            }

            return React.DOM.div({
                className : "worldHolder"

            }, charViews, placeViews);
        }
    });

    return {
        init : function(world, div) {
            return React.renderComponent(WorldView({
                world : world
            }), div.get(0));
        },
    };
});
