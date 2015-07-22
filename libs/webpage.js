/* jshint browser: true */
var remote = require('remote');
var ipc = require('ipc');

(function(global, $){

    var system = {};

    $(function() {    
        system.init();
    });

    system = {
        
        init: function() {
            ipc.on('setContent', function(content){
                $('.content').html(content);
            });
            ipc.on('connected', function(){
                $('.content').html('<div class="connected"><i class="glyphicon glyphicon-signal"></i><p>Connected</p></div>')
            });
        }

    };

    global.system = system;

})(this, jQuery);