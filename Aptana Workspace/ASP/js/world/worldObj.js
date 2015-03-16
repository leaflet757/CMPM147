/**
 * @author Kate
 */

define(["common"], function(common) {
    'use strict';

    var Prop = Class.extend({
        init : function(parent, name, value) {
            this.parent = parent;
            this.name = name;
            this.value = value;
        },

        setTo : function(value) {
            this.value = value;
        }
    });

    var WorldObject = Class.extend({
        init : function(parent, name, settings) {
            $.extend(this, settings);
            this.name = name;
            this.parent = parent;

            this.props = {};
            this.objs = {};

        },

        createFacts : function() {
            var facts = [];
            this.applyToProps(function(prop, propName, obj) {
                var fact = propName + "(" + obj.name + ", " + prop.value + "). ";
                facts.push(fact);
            });
            return facts;
        },

        createProp : function(name, value) {
            if (this.props[name])
                return this.props[name];
            this.props[name] = new Prop(this, name, value);
            return this.props[name];
        },

        createObj : function(name) {
            if (this.objs[name])
                return this.objs[name];
            this.objs[name] = new WorldObject(name, this);
            return this.objs[name];
        },

        applyToProps : function(fxn) {
            for (var name in this.props) {
                if (this.props.hasOwnProperty(name)) {
                    fxn(this.props[name], name, this);
                }
            };
        },

        setProp : function(propName, value) {
            if (this.props[propName] === undefined) {

                this.createProp(propName, value);
                return true;
            } else if (this.props[propName].value === value) {
                //      console.log(this.name + " " + propName + " " + value + " already true");
                return false;
            } else {
                this.props[propName].value = value;
                return true;
            }
        },

        applyToObjs : function(fxn) {
            for (var name in this.props) {
                if (this.objs.hasOwnProperty(name)) {
                    fxn(this.objs[name], name, this);
                }
            };
        },

        toString : function() {
            return this.name;
        }
    });

    return WorldObject;
});
