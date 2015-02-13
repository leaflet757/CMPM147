// Tumblr Information
var tumblr = require('./vendor/tumblr');
tumblr.request(require('request'));
var Blog;

var jq = require('./vendor/jquery-1.11.1.min');
// var reqq = require('./vendor/require');
//var inher = require('./vendor/inheritance');

require("amd-loader");


var grammars = require('./twitTracery/grammars');
//console.log(grammars);
var Tracery = require('./twitTracery/tracery');
console.log('printing tracery');
//console.log(Tracery);
var sadSpeak = Tracery.createGrammar(grammars.sadandalone);
var sadTags = ["4everalone", "howcouldthishappentome", "justlikethegypsywomansaid", "doesmeganhateme", "pleasecomebackmegan"];
var count = 0;

var client = tumblr.createClient({
	consumer_key : 'xxxxxxxxxxx',
	consumer_secret : 'xxxxxxxxxxx',
	token : 'xxxxxxxxxxxxx',
	token_secret : 'xxxxxxxxxxxxxxxx'
});

setTimeout(function() {
	client.userInfo(function(err, data) {
		data.user.blogs.forEach(function(blog) {
			console.log(blog);
			if (!Blog) {
				Blog = blog;
				console.log("Active Blog is: " + Blog.name);
			}
		});
	});

}, 0);

setInterval(function() {

	count++;
	console.log("Updating: ", Blog.name, " at count ", count, "...");
	if (Blog) {

		client.userInfo(function(err, data) {
			Blog = data.user.blogs[0];
		});

		// grab tracery text
		var text = sadSpeak.createFlattened("#origin#");
		console.log(text);	
		
		// print random hashtag
		var index = Math.round(Math.random() * (sadTags.length-1));
		
		client.text(Blog.name, {
			// update the text for the blog
			//title : "",
			body : text,
			tags : sadTags[index]
			
		}, function(err) {
			//console.log("something went wrong");
		});
		
	} else {
		console.log("blog is not defined");
	}

}, 5000);
