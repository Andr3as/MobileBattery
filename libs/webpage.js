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
                //Activate selects
                $('.select').selectpicker();
            });
            ipc.on('connected', function(){
                $('.content').html('<div class="connected"><i class="glyphicon glyphicon-signal"></i><p>Connected</p></div>')
            });
            //Roles
            $(document).on('click', '.btn[role="close"]', function(){
                window.close();
            });
        },

        send: function(event, args) {
            ipc.send(event, args);
        },

    };

    global.system = system;

})(this, jQuery);