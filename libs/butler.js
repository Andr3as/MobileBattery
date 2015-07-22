var BrowserWindow = require('browser-window');
var Dialog = require('dialog');
var IPC = require('ipc');
var Tray = require('tray');

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
    },

    disconnect: function() {
        this.app.quit();
    },

    handleTray: function(event, bounds) {
        if (this.app.mainWindow != null) {
            this.app.mainWindow.focus();
        }
    },

    start: function() {
        var _this = this;
        
        if (this.app.server != null) {
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
        console.log(this.app.mainWindow);
        var content = Loader.loadTemplate("start.html");
        this.app.mainWindow.webContents.on('did-finish-load', function() {
            _this.app.mainWindow.webContents.send('setContent', content);
        });
    },

    updateTray: function(level, isCharging, saving_mode) {
        var _this = this;
        var name = Renderer.createName(level, isCharging, saving_mode);
        var path = this.app.basepath + '/res/img/tray/' + name;
        
        fs.access(path + '.png', fs.R_OK | fs.W_OK, function(err) {
            var fn = function() {
                if (_this.app.tray == null) {
                    _this.app.tray = new Tray(path + '.png');
                    _this.app.tray.on('clicked', _this.handleTray.bind(_this));
                } else {
                    _this.app.tray.setImage(path + '.png');
                }
            }

            if (err) {
                Renderer.render(level, isCharging, saving_mode, path + '.svg');
                //Generate png from svg file
                svg2png(path + '.svg', path + '.png', 0.3, function (err) {
                    if (err) console.log("svg2png", err);
                    fn();
                });
            } else {
                fn();
            }
        });
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
        if (addresses.length == 0) {
            //ToDo show error
        }

        return addresses;
    },

    __getFocusedWindow: function() {
        return BrowserWindow.getFocusedWindow();
    },
};

module.exports = Butler;