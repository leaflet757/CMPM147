/**
 * @author Kate
 */

define(["common", "./worldObj", "./worldView"], function(common, WorldObj, worldView) {
    'use strict';

    var world = new WorldObj("world");
 
    var view = worldView.init(world, $("#worldView"));

    world.updateView = function() {
        console.log("Update view");
        console.log(this);
        view.setState({});
    };

    return world;
});
