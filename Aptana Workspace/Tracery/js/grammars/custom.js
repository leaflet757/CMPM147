/**
 * @author Kate Compton
 */
define([], function() {'use strict';

	return {
		sadadjectives : ["lost", "sad", "desperate", "alone", "pathetic", "useless", "worthless", "poor", "sorry", "torn", "guilty", "responsible", "wrong", "tired", "foolish", "dead", "dull",],
		sadnoun : ["friends", "love", "peace in me", "hope", "restraint"],
		sadverb : ["cry", "shrivel", "die", "collapse", "fall", "ache", "moan", "regret"],
		verb : ["talk", "eat", "swim", "laugh", "gossip", "support", "like", "love"],
		angryadjective : ["irritated", "mad", "angry", "annoyed", "bitter", "childish", "stupid", "annoying"],
		angrynoun : ["school", "relationships", "money", "drama", "parents", "curfew", "puberty"],
		angrystatement : ["It's not worth it", "It's so stupid", "Oh well", "Not that it matters", "I'm so #angryadjective#", "Life sucks"],
		insult : ["nerd", "loser", "pansy", "sissy", "geek", "good for nothing"],
		school : ["gym", "math", "history", "english", "german", "econ"],
		activity : ["school", "#school# class"],
		
		time : ["today", "yesturday", "this morning", "this evening", "earlier today", "this afternoon"], 
		timeAdj : ["quickly", "slowly"],
		
		doesmything : ["care", "play music", "watch #guy# #verb#", "watch #girl# #verb#", "avoid #person#", "go to class", "finish homework", "get home", "get some peace and quiet", "avoid #activity#"],
		doesathing : ["#verb.s# with #girl#", "shows off", "acts like they are #angryadjective#"],
		
		thing : ["people"], 
		guy : ["Rupert", "Micheal", "The teacher"],
		girl : ["Alexsis", "Sarah"],
		pronoun : ["he", "she", "it"],
		person : ["#guy#", "#girl#", "#family#"], 
		family : ["Mom", "Dad", "Grandpa", "Grandma"],
		
		relateBlog : ["relate post"], // TODO: currently unused
		angeryBlog : ["[angrySub:#angrynoun#]#angrySub#. That's it. That's all I'm going to say about #angrySub#. #angrystatement#. If I could just #doesmything# then I would have been able to avoid #angrySub#. Maybe if #pronoun# didnt act like a #angryadjective# #insult#. #angrystatement#. #angrystatement#."],
		sadBlog : ["I don't know why I cant find any #sadnoun#. It's like [mPerson:#guy#]#mPerson# [tThing:#doesathing#]#tThing# to make me feel #sadadjectives#. #time# I tried to #doesmything# yet #mPerson# still #tThing#. It makes me want to #sadverb# and #sadverb#."],
		neutralBlog : ["nnnnnnnn"],
		shortBlog : ["Why", "never again", "why do I even #sadverb#", "im done", ], 
		
		greeting : ["I hate #thing#", "I feel so #sadadjectives#", "It happened again #time#"],
		statement : ["#angeryBlog#", "#sadBlog#", "#neutralBlog#", "#shortBlog#"], 
		origin : ["#greeting#. <p></p>#statement#"]
	};

    /*return {
        introTheWeather : ["And now, the weather."],
        instrument : ["ukulele", "vocals", "guitar", "clarinet", "piano", "harmonica", "sitar", "tabla", "harp", "dulcimer", "violin", "accordion", "concertina", "fiddle", "tamborine", "bagpipe", "harpsichord", "euphonium"],
        musicModifier : ["heavy", "soft", "acoustic", "psychedelic", "light", "orchestral", "operatic", "distorted", "echoing", "melodic", "atonal", "arhythmic", "rhythmic", "electronic"],
        musicGenre : ["metal", "electofunk", "jazz", "salsa", "klezmer", "zydeco", "blues", "mariachi", "flamenco", "pop", "rap", "soul", "gospel", "buegrass", "swing", "folk"],
        musicPlays : ["echoes out", "reverberates", "rises", "plays"],
        musicAdv : ["too quietly to hear", "into dissonance", "into a minor chord", "changing tempo", "to a major chord", "staccatto", "into harmony", "without warning", "briskly", "under the melody", "gently", "becoming #musicGenre#"],
        song : ["melody", "dirge", "ballad", "poem", "beat poetry", "slam poetry", "spoken word performance", "hymn", "song", "tone poem", "symphony"],
        musicAdj : ["yielding", "firm", "joyful", "catchy", "folksy", "harsh", "strong", "soaring", "rising", "falling", "fading", "frantic", "calm", "childlike", "rough", "sensual", "erotic", "frightened", "sorrowful", "gruff", "smooth"],
        themeAdj : ["lost", "desired", "redeemed", "awakened", "forgotten", "promised", "broken", "forgiven", "remembered", "betrayed"],
        themeNoun : ["the future", "love", "drinking", "space travel", "the railroad", "your childhood", "summertime", "the ocean", "sexuality", "wanderlust", "war", "divorce", "nature", "pain", "hope", "a home", "a lover", "a friend", "a marriage", "family", "death"],
        theme : ["#themeNoun# #themeAdj#"],
        weatherSentence : ["You recall #themeNoun# and #themeNoun#.", "It reminds you of the time you had #themeAdj# #themeNoun#.", "This is #musicAdj.a# #song# about #musicTopic#.", "#musicTopic.capitalize# is like #theme#, #musicAdj#.", "The singer's voice is #musicAdj#, #musicAdj#, yet #musicAdj#.", "#musicModifier.capitalize# #musicGenre# #instrument# #musicPlays# #musicAdv#."],
        weatherDescription : ["[musicTopic:#theme#]#weatherSentence# #weatherSentence# #weatherSentence# [musicTopic:POP]"],
        theWeather : ["#introTheWeather#<p class='weather'>Music plays. #weatherDescription#</p>"],
        react : ["shake", "moan", "cry", "scream", "wail", "rejoice", "dance", "cower", "howl"],

        // Simple
        color : "orange blue white black grey purple indigo".split(" "),
        animal : "spider raven crow scorpion coyote eagle owl lizard deer".split(" "),
        concept : "#substance# #emotion# darkness love childhood time loss victory memory art thought belief life death caring".split(" "),
        transitiveEmotion : ["fear", "regret", "long for", "love", "distrust", "trust", "envy", "care for"],
        sense : ["feel", "hear", "see", "know"],

        natureNoun : ["ocean", "mountain", "forest", "cloud", "river", "tree", "sky", "earth", "void", "desert"],
        concreteNoun : ["#animal#", "#natureNoun#"],
        verb : ["#transitiveEmotion#", "#react#"],
        never : ["never", "never again", "hardly ever", "barely", "almost always", "always", "probably never", "even"],

        glowing : ["glowing", "rising", "hovering", "pulsing", "blinking", "glistening"],
        beingWith : ["talking to", "walking with", "listening to"],
        weirdAdj : ["weird", "arcane", "dark"],
        truly : ["safely", "truly", "legally", "ever", "already"],
        person : ["angel", "woman", "man", "figure"],
        character : ["#charAdj# #person#"],
        charAdj : ["old", "young", "hooded", "headless", "dead-eyed", "faceless"],
        charDescription : ["#never# #react.s# when they #sense# the #natureNoun#"],
        arentReal : ["are illegal", "don't exist"],
        ofCourse : ["obviously", "well, clearly", "seriously", "as we #truly# know", "as everybody knows"],

        youKnow : ["#ofCourse#", "I mean", "well", "I guess", "you know", "#maybe#"],
        episode : ["[mc:#character#][mcDesc:#charDescription#][myNoun:#concreteNoun#] This is a story about #mc.a#. You know, the #mc# who #mcDesc#. Well, I was #beingWith# the #mc#, when we both saw this #myNoun#.  #glowing.capitalize#, #color#...well, more of #color.a#ish #color#.   We backed away because #ofCourse#, #myNoun.s# #arentReal#. That was the last we saw of it. #theWeather#  <p>You know, I miss the #myNoun#.  It was #evaluationAdj#.  I mean, #evaluationAdj#, for a #myNoun#.  #someday.capitalize#, I hope it comes back.  We'll see it, #glowing#, #color#...well, more of #color.a#ish #color#.  But it'll be back. #youKnow.capitalize#, #someday#. If not, #vagueReaction#.[myNoun:POP][mc:POP] "],

        anyway : ["anyway", "in such a world as this", "if it were truly so", "if anything ever was"],
        butThen : ["but then", "if you could imagine", "for certain"],
        ominousStatement : ["who could you #truly# #transitiveEmotion#, #anyway#?", "if you understand my meaning.", "everyone knows that.", "you had known that for years.", "you knew that already."],
        recommend : ["mandate", "recommend", "advise", "suggest"],
        asMyGrandmotherSaid : ["as #authority# always said", "as #authority# tells us", "as #recommend.ed# by #authority#"],
        substance : "blood sand dust nothingness darkness light soil earth mud tar water bones flies honey".split(" "),
        emotion : "fear love trust desire pride sorrow regret confusion glee happiness contentment terror anger rage jealousy".split(" "),
        evaluationAdjBare : ["good", "great", "wonderful", "terrifying", "bewildering", "perfect", "beautiful", "terrible"],
        evaluationAdj : ["just #evaluationAdjBare#", "pretty #evaluationAdjBare#", "#evaluationAdjBare#", "really #evaluationAdjBare#"],
        maybe : ["I think", "maybe", "probably", "almost certainly"],
        someday : ["in the end", "if the sun rises again", "when the time comes", "in a while", "eventually", "sooner or later"],
        relative : ["mother", "father", "grandmother", "grandfather"],
        authority : ["the government", "the sheriff's secret police", "the law", "the radiochip implanted in your mind", "the Constitution", "a secret, yet menacing government society", "your own #relative#", "my own #relative#"],
        fullOf : ["full of", "covered in", "made of"],

        vagueReaction : ["we all #react# and #react# in #emotion#", "it's about time", "it's #evaluationAdj#", "it's just so #evaluationAdj#", "I couldn't be happier", "isn't that #evaluationAdj#", "there's nothing that can be done", "but it hasn't always been that way", "but it won't always be that way"],
        pithySaying : ["#never# trust a #concreteNoun#. You can trust a #concreteNoun#, #maybe#", "I #verb#, therefore I am", "it's #concreteNoun.s# all the way down", "#concept# is the new #concept#", "the only good #concreteNoun# is a dead #concreteNoun#"],

        saying : ["[myThing:#concreteNoun#][mySub:#substance#]Don't #transitiveEmotion# the #myThing# because the #myThing# is #fullOf# #mySub#.  You will be #fullOf# #mySub#, too, #someday#.[myThing:POP][mySub:POP]", "[myThing:#concreteNoun#]The #myThing# #react.s#.  The #myThing# #react.s#. The #myThing# #react.s# with #emotion# because it #sense.s# the #concept# that it will never have.[myThing:POP]", "[myThing:#concreteNoun#]We #sense# the #myThing# and #react# with #emotion#.  You #sense# the #myThing# and #react# with #emotion#.  The #myThing# #sense.s# you but does not #react#.[myThing:POP]", "[mySub:#substance#]The #natureNoun# is made of #mySub#. The #natureNoun# is made of #mySub#. We are all made of #mySub# and #vagueReaction#.[mySub:POP]", "[emo1:#transitiveEmotion#]#never.capitalize# #emo1# #concept#. Only ever #emo1# #concept#.  How could you #emo1# what you can #never# #sense#?[emo1:POP]", "#asMyGrandmotherSaid.capitalize#, #pithySaying#. #butThen.capitalize#... #ominousStatement#"],
        origin : ["#saying#<p>Welcome to Night Vale. <p>...</p>#episode#<p>...</p>Goodnight, Night Vale, goodnight."]
    };*/
});
