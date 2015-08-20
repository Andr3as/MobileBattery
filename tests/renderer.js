/* Renderer test */
var app = require("./app.js");
var svg2png = require('svg2png');

var Renderer = require(app.basepath + "/libs/renderer.js");
Renderer.init(app);

var path = app.basepath + "/tests/exports/";

var png = function(name) {
	svg2png(path + name + '.svg', path + name + '.png', 0.3, function (err) {
        if (err) console.log("svg2png", err); return;
    });
}

//Value + no loading
Renderer.settings.display_level = "true";
for (var i = 0; i <= 100; i++) {
	var name = Renderer.createName(i, false, false);
	Renderer.render(i, false, false, path + name + ".svg");

	png(name);
}

//Value + loading
for (var i = 0; i <= 100; i++) {
	var name = Renderer.createName(i, true, false);
	Renderer.render(i, true, false, path + name + ".svg");

	png(name);
}

//no value + loading
Renderer.settings.display_level = "false";
var name = Renderer.createName(0, true, false);
Renderer.render(0, true, false, path + name + ".svg");
png(name);

//no value + no loading
var values = [0,10,40,70];
for (var i = 0; i < values.length; i++) {
	var name = Renderer.createName(values[i], false, false);
	Renderer.render(values[i], false, false, path + name + ".svg");

	png(name);
}