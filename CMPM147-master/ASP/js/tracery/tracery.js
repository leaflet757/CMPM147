/**
 * @author Kate Compton
 */
var tracery = {};

define(["common", "./utilities", "./grammar", "./node"], function(common, traceryUtilities, Grammar, Node) {'use strict';

    $.extend(tracery, traceryUtilities);

    tracery.createGrammar = function(json) {
        var grammar = new Grammar();
        grammar.loadFromJSON(json);
        return grammar;
    };

    tracery.test = function() {
        /*
         console.log("==========================================");
         console.log("test tracery");
         tracery.parse("#someSymbol# and #someOtherSymbol#");
         tracery.parse("#someSymbol# and #someOtherSymbol");
         tracery.parse("#someOtherSymbol.cap.pluralize#");
         tracery.parse("#[#do some things#]symbol.mod[someotherthings[and a function]]#");
         tracery.parse("#[fxn][fxn][fxn[subfxn]]symbol[fxn]]#");
         */

        tracery.parse("#hero# ate some #color# #animal.s#");

      
        var node = new Node(grammar, "#[hero:#name#]adventure#");
        node.expand();
        app.currentExpansions[0] = node;
    };
});
