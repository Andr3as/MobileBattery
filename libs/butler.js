var BrowserWindow = require('browser-window');
var Dialog = require('dialog');
var IPC = require('ipc');
var Tray = require('tray');
var exec = require('child_process').exec;

var fs = require('fs');
var os = require('os');
var crypto = require('crypto');

var QR = require('qr-image');
var svg2png = require('svg2png');

var Server = require(__dirname + '/server.js');
var Renderer = require(__dirname + '/renderer.js');

var i18n = null;
var Loader  = null;


var Butler = {

    app: null,

    init: function(app) {
        var _this = this;
        this.app = app;
        //Init subscripts
        i18n = app.i18n;
        Loader = app.Loader;

        Renderer.init(app);

        //Register listeners
        app.on('cut', function(){
            var focused = _this.__getFocusedWindow();
            if (typeof(focused) != 'undefined') {
                focused.webContents.cut();
            }
        });
        app.on('copy', function(){
            var focused = _this.__getFocusedWindow();
            if (typeof(focused) != 'undefined') {
                focused.webContents.copy();
            }
        });
        app.on('open_settings', function(){
            _this.openSettings();
        });
        app.on('open_website', function(url){
            _this.__openWebsite(url);
        });
        app.on('paste', function(){
            var focused = _this.__getFocusedWindow();
            if (typeof(focused) != 'undefined') {
                focused.webContents.paste();
            }
        });
        app.on('reload', function(){
            var focused = _this.__getFocusedWindow();
            if (typeof(focused) != 'undefined') {
                focused.reloadIgnoringCache();
            }
        });
        app.on('toggleDevTools', function(){
            var focused = _this.__getFocusedWindow();
            if (typeof(focused) != 'undefined') {
                focused.toggleDevTools();
            }
        });
        //IPC messages
        IPC.on('changedSettings', function(){
            _this.__showError(i18n("Restart app to apply new settings."));
            //Confirm dialog
            app.quit();
        });
        IPC.on('error', function(e, args){
            if (typeof(args.title) != 'undefined' && typeof(args.content) != 'undefined') {
                Dialog.showErrorBox(i18n(args.title), i18n(args.content));
            }
        });
    },

    disconnect: function() {
        this.app.quit();
    },

    handleTray: function(event, bounds) {
        if (this.app.mainWindow !== null) {
            this.app.mainWindow.focus();
        }
    },

    start: function() {
        var _this = this;
        
        if (this.app.server !== null) {
            return;
        }

        var data = {};

        //Create a server
        this.app.server = Server.init(this.app);
        data.key = Server.getKey();
        data.port = Server.getPort();
        data.handshake = Server.getHandshake();

        //Get current ip adress
        data.ips = this.__getIPs();

        console.log(data);

        var code = this.__getCode(JSON.stringify(data));

        var output = fs.createWriteStream(this.app.basepath + '/res/img/qr.png');

        code.pipe(output);
        //Display qr code in mainWindow
        var content = Loader.loadTemplate("start.html");
        this.app.mainWindow.webContents.on('did-finish-load', function() {
            _this.app.mainWindow.webContents.send('setContent', content);
        });
    },

    openSettings: function(){
        var _this = this;
        var fn = function() {
            _this.app.mainWindow = new BrowserWindow({width: 500, height: 380, resizable: false});
            _this.app.mainWindow.loadUrl('file://' + _this.app.basepath + '/index.html');

            _this.app.mainWindow.on('closed', function() {
                _this.app.mainWindow = null;
            });

            var content = Loader.loadTemplate("settings.html");
            _this.app.mainWindow.webContents.on('did-finish-load', function() {
                _this.app.mainWindow.webContents.send('setContent', content);
            });
        };

        if (this.app.mainWindow !== null) {
            //Create new Window
            this.app.mainWindow.close();
            this.app.mainWindow.on('closed', fn);
        } else {
            fn();
        }
    },

    updateTray: function(level, isCharging, saving_mode) {
        var name = Renderer.createName(level, isCharging, saving_mode);
        var path = this.app.basepath + '/res/img/tray/' + name;
        
        if (this.app.tray === null) {
            this.app.tray = new Tray(path + '.png');
            this.app.tray.on('clicked', this.handleTray.bind(this));
        } else {
            this.app.tray.setImage(path + '.png');
        }
    },

    __getCode: function(data) {
        return QR.image(data);
    },

    __getIPs: function() {
        var interfaces = os.networkInterfaces();
        var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }

        console.log(addresses);
        if (addresses.length === 0) {
            this.__showError("No ip adress retrieved. Is the computer connected to WLAN?");
            this.app.quit();
        }

        return addresses;
    },

    __getFocusedWindow: function() {
        return BrowserWindow.getFocusedWindow();
    },

    __showError: function(msg) {
        if (this.app.OS.isDarwin()) {
            Dialog.showErrorBox(msg, "");
        } else {
            Dialog.showErrorBox(i18n("Notice!"), msg);
        }
    },

    __openWebsite: function(url) {
        if (typeof(url) == 'string') {
            if (this.app.OS.isWindows()) {
                exec("start " + url, function(){});
            } else {
                exec("open " + url, function(){});
            }
        }
    },
};

module.exports = Butler;