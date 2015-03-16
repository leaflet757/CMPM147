/**
 * @author Kate
 */

define(["common"], function(common) {
    'use strict';
    var westerosX = -90;
    return {

        places : {

            kingsLanding : {
                pos : new Vector(westerosX + 50, 70),
            },

            lannisport : {
                pos : new Vector(westerosX + -170, 60),
            },

            highgarden : {
                pos : new Vector(westerosX + -120, 120),
                connections : ["dorne", "lannisport"],
            },

            theEyrie : {
                pos : new Vector(westerosX + 50, -45),
            },

            theTwins : {
                pos : new Vector(westerosX + -80, -60),
                connections : ["winterfell"],
            },

            harrenhal : {
                pos : new Vector(westerosX - 40, 20),
                connections : ["theTwins", "theEyrie", "kingsLanding", "lannisport"],
            },

            dorne : {
                pos : new Vector(westerosX + 40, 160),
                connections : ["kingsLanding"]
            },
            winterfell : {
                pos : new Vector(westerosX + 20, -120),
                connections : ["castleBlack"]
            },

            pyke : {
                pos : new Vector(westerosX + -140, -80),
                connections : ["theTwins"]
            },
            castleBlack : {
                pos : new Vector(westerosX + -40, -160),
            },

        },

        characters : {
            nedStark : {
                gender : "male",
                house : "stark",
                loves : "catStark",
                weakness : "hasBastard"
            },
            catStark : {
                gender : "female",
                house : "stark",
                loves : "nedStark",
                marriedTo : "nedStark",
                hates : "jonSnow",
            },

            jonSnow : {
                gender : "male",
                house : "stark",
                loves : "ygritte",
                father : "nedStark",
            },

            sansa : {
                gender : "female",
                house : "stark",
                loves : "joffrey",
                father : "nedStark",
                mother : "catStark",
            },

            arya : {
                gender : "female",
                house : "stark",
                hates : "joffrey",
                father : "nedStark",
                mother : "catStark",
            },

            robbStark : {
                gender : "male",
                house : "stark",
                hates : "joffrey",
                father : "nedStark",
                mother : "catStark",
            },

            branStark : {
                gender : "male",
                house : "stark",
                father : "nedStark",
                mother : "catStark",
                weakness : "paralyzed"
            },

            // Lannisters
            joffrey : {
                gender : "male",
                house : "lannister",
                father : "jamie",
                mother : "cersei",
                hates : "tyrion",
                weakness : "incest"
            },

            cersei : {
                gender : "female",
                house : "lannister",
                father : "tywin",
                loves : "jamie",
                hates : "tyrion",
                weakness : "incest"
            },
            jamie : {
                gender : "male",
                house : "lannister",
                father : "tywin",
                loves : "cersei",
                weakness : "kingslayer"
            },
            tyrion : {
                gender : "male",
                house : "lannister",
                father : "tywin",
                hates : "tywin",
                weakness : "isDwarf"
            },
            tywin : {
                gender : "male",
                house : "lannister",
                hates : "tyrion",
            },
        }
    };
});
