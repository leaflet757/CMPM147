/**
 * @author Kate
 */

define(["common", "./clingo"], function(common, clingo) {
    console.log(Gringo);
    console.log(Clasp);

    function groundAndSolve(code, callback) {
        console.log(code);
        var width = 10;
        var grounderArgs = ["-c", "width=" + width];
        var solverArgs = ["--sign-def=3", "--heu=vsids", "--seed=" + (2 << 30 * Math.random() | 0)];

        console.log("grounding...");
        Gringo.groundAsync([code, grounderArgs], function(program) {
            console.log("solving...");
            Clasp.solveAsync([program, solverArgs], function(result) {
                console.log("done");
                // button.property("disabled", false);
                if (result.Witnesses) {

                    callback(result.Witnesses);
                } else {
                    alert("no solutions");
                }
            });
        });
    };

    return {
        groundAndSolve : groundAndSolve
    };
});

