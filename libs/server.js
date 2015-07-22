var crypto = require('crypto');
var express = require('express');
var bodyParser = require("body-parser");

var Server = {

    app: null,
	key: null,
    port: 3001,
    server: null,

    init: function(app, port) {
        this.app = app;
    	if (typeof(port) == 'undefined') {
    		port = this.port;
    	} else {
            this.port = port;

        }

        var server = express();
        server.use(bodyParser.urlencoded({ extended: false }));

        server.post("/handshake", this.handshake.bind(this));

        server.post("/battery", this.battery.bind(this));

        server.post("/disconnect", this.disconnect.bind(this));


        /// catch 404 and forwarding to error handler
        server.use(function(req, res, next) {
            console.log(req.path);
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        
    	this.generateKey();

        server.listen(port);
        this.server = server;
    	return this;
    },

    /* Getters */

    generateKey: function() {
    	var size = 16;
    	this.key = crypto.randomBytes(size).toString('hex');
    },

    getKey: function() {
    	return this.key;
    },

    getHandshake: function() {
        return "handshake";
    },


    getPort: function() {
        return this.port;
    },

    /* Crypting */

    encrypt: function(string) {
        return string;
    },

    decrypt: function(string) {
    	return string;
    },

    /* Handle requests */

    battery: function(request, response) {
        var hs = request.body.handshake;
        var level = request.body.level;
        var isCharging = request.body.charging;

        if (this.__checkHandshake(hs)) {
            level = this.decrypt(level);
            isCharging = this.decrypt(isCharging) == "true";

            this.app.Butler.updateTray(level, isCharging);
            console.log(level, new Date().getMinutes());

            response.json(this.__buildResponse(true));
        } else {
            response.json(this.__buildResponse(false, "No Authentication"));
        }
    },

    disconnect: function(request, response) {
        var hs = request.body.handshake;
        
        if (this.__checkHandshake(hs)) {
            response.json(this.__buildResponse(true));
            this.app.Butler.disconnect();
        } else {
            response.json(this.__buildResponse(false));
        }
    },

    handshake: function(request, response) {
        var hs = request.body.handshake;
        
        if (this.__checkHandshake(hs)) {
            response.json(this.__buildResponse(true));
            this.app.mainWindow.webContents.send('connected');
        } else {
            response.json(this.__buildResponse(false));
        }
    },

    /* Private methods */

    __buildResponse: function(result, msg, data) {
        return {result: result};
    },

    __checkHandshake: function(handshake) {
        return this.getHandshake() == this.decrypt(handshake);
    }
};

module.exports = Server;