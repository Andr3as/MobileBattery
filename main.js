app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var Menu = require('menu');
var Tray = require('tray');

var OS = require(__dirname + '/libs/os.js');
var Loader = require(__dirname + '/libs/loader.js');
var i18n = require(__dirname + '/libs/i18n.js');
var settings = require(__dirname + '/libs/settings.js');
var Butler	= require(__dirname + '/libs/butler.js');

//Call libs init
app.basepath = __dirname;
app.Loader = Loader;
app.OS = OS;
app.settings = settings;
app.Butler = Butler;


app.i18n = i18n.init(app);
Loader.init(app);
Butler.init(app);

app.mainWindow = null;
app.server = null;
app.tray = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	
	app.mainWindow = new BrowserWindow({width: 285, height: 380, resizable: false});
    app.mainWindow.loadUrl('file://' + app.basepath + '/index.html');

    app.mainWindow.on('closed', function() {
        app.mainWindow = null;
    });

    Butler.start();

	// Load main window menu
    var template = Loader.loadMenu('app.js')(app);
    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});