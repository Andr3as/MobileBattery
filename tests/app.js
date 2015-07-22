/* General frame to emulate app */

var app = {basepath: __dirname + "/.."};

var OS = require(app.basepath + '/libs/os.js');
var Loader = require(app.basepath + '/libs/loader.js');
var i18n = require(app.basepath + '/libs/i18n.js');
var settings = require(app.basepath + '/libs/settings.js');

//Call libs init
app.Loader = Loader;
app.OS = OS;
app.settings = settings;


app.i18n = i18n.init(app);
Loader.init(app);

module.exports = app;