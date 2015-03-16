/**
 * @author Kate Compton
 */

function spacer(size) {
    var s = "";
    for (var i = 0; i < size * 3; i++) {
        s += " ";
    }
    return s;
}

define(["common"], function(common) {
    'use strict';

    function activateAction(action, node) {
        switch(action.action) {
        case "PUSH":

            var rules = action.rule;
            if (!Array.isArray(rules))
                rules = [rules];

            // for each rule

            var results = rules.map(function(rule) {

                var newRoot = new RootNode(node.grammar, rule);
                newRoot.expand();
                return newRoot.finalText;
            });
            console.log(results);

            // Add the symbol if it doesnt exist
            var target = node.grammar.addSymbol(action.target);

            target.pushRules(results);
            action.stored = results;

            break;
        default:
            break;
        }
    }

    // A tracery expansion node

    // Node
    var nodeCount = 0;

    var Node = Class.extend({
        init : function(parent, parsed) {
            this.setup(parent);

            $.extend(this, parsed);

        },

        setup : function(parent) {
            this.depth = 0;
            this.id = nodeCount;
            nodeCount++;
            if (parent) {
                this.depth = parent.depth + 1;
                this.parent = parent;
                this.grammar = parent.grammar;
            }

        },

        expand : function() {

            var rule = this.grammar.getRule(this.symbol);
            if (rule.error)
                this.error = rule.error;

            // Parse the rule if it hasn't been already

            if (!rule.parsed) {
                if (!rule.raw) {
                    console.log(this);
                    console.log(rule);
                }
                rule.parsed = tracery.parse(rule.raw);
            }

            $.extend(this, rule.parsed);

            var parent = this;

            // Do any pre-expansion actions!
            for (var i = 0; i < this.prefxns.length; i++) {

                activateAction(this.prefxns[i], this);
            }

            this.children = this.sections.map(function(section) {

                if ( typeof section == 'string') {
                    return new TextNode(parent, section);
                } else {
                    return new Node(parent, section);
                }
            });
            this.expandChildren();
            this.finalText = this.childText;
            for (var i = 0; i < this.modifiers.length; i++) {
                this.finalText = this.grammar.applyMod(this.modifiers[i], this.finalText);
            }
        },

        expandChildren : function() {

            this.childText = "";
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].expand();
                this.childText += this.children[i].finalText;
            }

            this.finalText = this.childText;
        },

        toLabel : function() {
            return this.symbol;
        }
    });

    var RootNode = Node.extend({

        init : function(grammar, raw) {
            this.setup();
            this.grammar = grammar;

            this.parsed = tracery.parse(raw);
        },

        expand : function() {

            var parent = this;
            this.children = this.parsed.sections.map(function(section) {
                if ( typeof section == 'string') {
                    return new TextNode(parent, section);
                } else {
                    return new Node(parent, section);
                }
            });
            this.expandChildren();
        },

        toLabel : function() {
            return "root";
        }
    });

    var TextNode = Node.extend({
        isLeaf : true,
        init : function(parent, text) {
            this.setup(parent);
            this.text = text;
            this.finalText = text;
        },
        expand : function() {
            // do nothing
        },

        toLabel : function() {
            return this.text;
        }
    });

    return RootNode;

});
