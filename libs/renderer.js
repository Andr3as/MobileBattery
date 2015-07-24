var fs = require("fs");

var Renderer = {

    app: null,
    template: "",
    settings: {},

    init: function(app) {
        this.app = app;
        this.settings = app.settings;
        this.__loadTemplate();
    },

    render: function(value, isCharging, saving_mode, file) {
        saving_mode = saving_mode || false;
        file = file || this.app.basepath + "/res/img/tray.svg";

        var width = 950;

        var image = this.template;
        
        if (isCharging) {
            image = this.__insertCharging(image);
        } else {
            if (value > 5) {
                image = this.__insertFirstRect(image);
            }
            if (value > 33) {
                image = this.__insertSecondRect(image);
            }
            if (value > 66) {
                image = this.__insertThirdRect(image);
            }
        }

        
        if (value >= 10) {
            width = 1050;
        }
        if (value >= 100) {
            width = 1150;
        }
        
        //Add level as text
        var level = value;
        if (this.settings.display_level != "true") {
            level = "";
            width = 612;
        }
        
        image = image.replace("VALUE", level + "%");

        image = image.replace("WIDTH", width + "px");

        var color = "black";
        if (saving_mode) {
            //Color orange
            color = "#FF5033";
        }
        image = image.replace(/COLOR/g, color);
        

        fs.writeFile(file, image, 'utf8', function(){});
    },

    createName: function(value, isCharging, saving_mode){
        var name = "tray" + value;
        if (this.settings.display_level == "true") {
            name += "t";
        } else {
            name += "f";
        }


        if (isCharging) {
            name += "t";
        } else {
            name += "f";
        }

        if (saving_mode) {
            name += "t";
        } else {
            name += "f";
        }

        name += "@5x";
        return name;
    },

    __loadTemplate: function() {
        this.template = this.app.Loader.load(this.app.basepath + '/res/img/battery.svg' ,true);
    },

    __insertFirstRect: function(image) {
        var rect = '<rect x="420.372" y="215.491" width="123.666" height="181.011"/>';
        return image.replace("<!-- FIRST -->", rect);
    },

    __insertSecondRect: function(image) {
        var rect = '<rect x="268.868" y="215.491" width="124.981" height="181.011"/>';
        return image.replace("<!-- SECOND -->", rect);
    },

    __insertThirdRect: function(image) {
        var rect = '<rect x="117.025" y="215.491" width="123.334" height="181.011"/>';
        return image.replace("<!-- THIRD -->", rect);
    },

    __insertCharging: function(image) {
        var lightning = '<polygon transform="matrix(1.0842231,0,0,1.0842231,116.58154,62.353969)" points="182.691,322.104 269.701,210.375 214.544,210.375 238.059,127.334 151.049,239.062 206.206,239.062"/>';
        return image.replace("<!-- CHARGING -->", lightning);
    }
};

module.exports = Renderer;