/**
 * @author Kate Compton
 */

//var exx = require('../node_modules/extend/index');
//console.log(exx);
var tracery = {};
 
define(["common", "./utilities", "./grammar"], function(common, traceryUtilities, Grammar) {'use strict';

    $.extend(tracery, traceryUtilities);

    tracery.createGrammar = function(json) {
        var grammar = new Grammar();
        grammar.loadFromJSON(json);
        return grammar;
    };
});

// define(["./utilities", "./grammar"], function(traceryUtilities, Grammar) {'use strict';
// 
	// console.log('traceutil', traceryUtilities);
	// console.log('gammar', Grammar);
// 
    // exx(tracery, traceryUtilities);
// 
    // tracery.createGrammar = function(json) {
        // var grammar = new Grammar();
        // grammar.loadFromJSON(json);
        // return grammar;
    // };
// });
