/* Renderer test */
var app = require("./app.js");

var Renderer = require(app.basepath + "/libs/renderer.js");
Renderer.init(app);


Renderer.render(100, false, app.basepath + "/tests/exports/l100f.svg");
Renderer.render(100, true, app.basepath + "/tests/exports/l100t.svg");
Renderer.render(60, false, app.basepath + "/tests/exports/l60f.svg");
Renderer.render(60, true, app.basepath + "/tests/exports/l60t.svg");
Renderer.render(30, false, app.basepath + "/tests/exports/l30f.svg");
Renderer.render(30, true, app.basepath + "/tests/exports/l30t.svg");
Renderer.render(2, false, app.basepath + "/tests/exports/l2f.svg");
Renderer.render(2, true, app.basepath + "/tests/exports/l2t.svg");