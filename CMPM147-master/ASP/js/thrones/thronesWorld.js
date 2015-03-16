/**
 * @author Kate
 */

define(["common", "../world/world", "./place", "./character", "./data", "../asp/solver"], function(common, world, Place, Character, data, solver) {
    Array.prototype.contains = function(needle) {
        for (i in this) {
            if (this[i] == needle)
                return true;
        }
        return false;
    };

    function start() {

        app.world = world;

        world.places = [];
        world.characters = [];
        world.connections = [];

        // Turn all the places and characters into game objects

        for (var name in data.places) {
            if (data.places.hasOwnProperty(name)) {
                world.objs[name] = new Place(world, name, data.places[name]);
            }
        };

        for (var name in data.characters) {
            if (data.characters.hasOwnProperty(name)) {
                world.objs[name] = new Character(world, name, data.characters[name]);
            }
        };

        // make connections
        for (var i = 0; i < world.places.length; i++) {
            var start = world.places[i];
            if (start.connections) {

                for (var j = 0; j < start.connections.length; j++) {
                    var end = world.objs[start.connections[j]];

                    start.connectedTo.push(end);
                    end.connectedTo.push(start);

                    if (start.id < end.id) {
                        world.connections.push([start, end]);
                    } else
                        world.connections.push([end, start]);

                }
            }
        }

        world.draw = function(g) {

            g.fill(0);
            for (var i = 0; i < world.places.length; i++) {
                world.places[i].draw(g);
            }

            for (var i = 0; i < world.characters.length; i++) {
                world.characters[i].draw(g);
            }

            for (var i = 0; i < world.connections.length; i++) {
                g.stroke(0, 0, 0, .3);
                world.connections[i][0].pos.drawLineTo(g, world.connections[i][1].pos);
            }
        };

        world.updateView();

        function makeFactsAndSolve() {

            var facts = [];
            for (var i = 0; i < world.characters.length; i++) {
                facts = facts.concat(world.characters[i].createFacts());
                facts.push("character(" + world.characters[i].name + "). ");
            }

            for (var i = 0; i < world.places.length; i++) {
                facts.push("place(" + world.places[i].name + "). ");
            }

            for (var i = 0; i < world.connections.length; i++) {
                var road = world.connections[i];
                facts.push("connectedTo(" + road[0].name + "," + road[1].name + "). ");
                facts.push("connectedTo(" + road[1].name + "," + road[0].name + "). ");

            }

            facts = facts.sort(function(a, b) {
                return a - b;
            });

            var factString = facts.join("\n");
            var rules = "";
            rules += "isParent(P, C) :- father(C, P).\n";
            rules += "isParent(P, C) :- mother(C, P).\n";

            rules += "hasDaughter(P, D) :- isParent(P, D), gender(D, female).\n";
            rules += "hasSon(P, S) :- isParent(P, S), gender(S, male).\n";

            rules += "canAllyWith(A, B) :- hates(A, C), hates(B, C), A!=B.\n";

            //rules += "engagedTo(S, D) :- hasDaughter(P0, D), hasSon(P1, S), .\n";

            // prevent multiple engagements
            // rules += ":- engagedTo(S, D), engagedTo(S, D2), D2=D .\n";

            // For each male person, pick between 0 and 1 female persons to love (vice versa)
            rules += "{ loves(A, B) :gender(B, female) } 1 :- gender(A, male).";
            rules += "{ loves(A, B) :gender(B, male) } 1 :- gender(A, female).";

            // New pos
            rules += "1 { new_isAt(A, B) :place(B) } 1 :- character(A).";

            // No parental incest
            rules += ":- loves(A, B), isParent(A, B).";
            rules += ":- loves(A, B), isParent(B, A).";

            // rules += " formConspiracy(A, B) :- hates(A, C), hates(B, C), A < B. ";
            //rules += " useWeaknessAgainst(A, W, B) :- hates(A, B), hasWeakness(B, W). ";
            factString += rules;

            // Solve and parse these facts
            var watchWords = ["new_isAt"];

            solver.groundAndSolve(factString, function(solutions) {
                console.log(solutions[0]);
                var rules = solutions[0].Value.map(function(line) {

                    var startParen = line.indexOf("(");
                    var endParen = line.indexOf(")");
                    var params = line.substring(startParen + 1, endParen).split(",");
                    var prop = line.substring(0, startParen);
                    if (watchWords.contains(prop)) {
                        console.log(prop + ": " + params);
                    };

                    // if theres a second parameter
                    if (params[1]) {
                        // Set new values
                        var obj = world.objs[params[0]];
                        if (prop.lastIndexOf("new_", 0) === 0) {
                            prop = prop.substring(4, prop.length);
                            obj.changeProp(prop, params[1]);
                        } else
                            obj.setProp(prop, params[1]);
                    }
                });

                world.updateView();
            });
        }


        $("#solve").click(function() {
            makeFactsAndSolve();

        });

        // Do the solving
        makeFactsAndSolve();

    };

    return {
        start : start
    };

});
