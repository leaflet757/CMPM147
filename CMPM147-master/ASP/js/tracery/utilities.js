/**
 * @author Kate Compton
 */

function isAllCaps(s) {
    return (s.toUpperCase() === s)

};

define([], function() {
    'use strict';
    function parseAction(s) {
        var sides = s.split(":");

        if (isAllCaps(sides[0]))
            return {
                target : sides[0],
                action : sides[1],
            };

        return {
            target : sides[0],
            rule : sides[1],
            action : "PUSH",
        };
    };

    function parseSection(s) {
        var prefxns = [];
        var postfxns = [];
        var mods = [];
        // strip off any brackets stuff
        var pre = true;
        var start = 0;
        var mid = "";
        var lvl = 0;
        for (var i = 0; i < s.length; i++) {
            var c = s.charAt(i);

            switch(c) {
            case '[':
                if (lvl === 0) {
                    start = i + 1;
                }
                lvl++;

                break;
            case ']':
                lvl--;

                if (lvl === 0) {
                    // create a function
                    var fxn = parseAction(s.substring(start, i));
                    if (pre)
                        prefxns.push(fxn);
                    else
                        postfxns.push(fxn);
                }

                start = i + 1;
                break;
            default:
                if (lvl === 0) {
                    pre = false;
                    mid += c;
                }

                break;

            }
        }

        var midSplit = mid.split(".");
        var symbol = midSplit[0];
        mods = midSplit.slice(1, midSplit.length);
        return {

            raw : s,
            symbol : symbol,
            modifiers : mods,
            prefxns : prefxns,
            postfxns : postfxns,
        };
    }

    return {
        parse : function(s) {
            if (!s)
                throw ("Can't parse undefined");

            // Split into nodes and texts, ignoring anything in brackets
            var lvl = 0;

            var sections = [];
            var sectionStart = 0;
            var inHashtag = false;

            for (var i = 0; i < s.length; i++) {
                var c = s.charAt(i);
                switch(c) {
                case '#':
                    // Ignore stuff in brackets
                    if (lvl === 0) {
                        // start hashtag
                        if (!inHashtag) {
                            // Add previous section as a string
                            sections.push(s.substring(sectionStart, i));
                            sectionStart = i + 1;
                            inHashtag = true;
                        }

                        // end hashtag
                        else {
                            // Add previous section as a node-trigger
                            var sub = s.substring(sectionStart, i);
                            sections.push(parseSection(sub));
                            sectionStart = i + 1;
                            inHashtag = false;
                        }
                    }

                    break;
                case '[':
                    lvl++;
                    break;
                case ']':
                    lvl--;
                    if (lvl < 0) {
                        console.warn("Unbalanced bracket at " + i + "!");
                        return undefined;
                    }
                    break;
                }
            }

            sections.push(s.substring(sectionStart, i));

            if (inHashtag) {
                console.warn("Unbalanced hashtags at " + i + "!");
                console.warn(s);
                return undefined;
            }

            return {
                raw : s,
                sections : sections
            };
        }
    };
});
