module.exports = function(app){
    var i18n = app.i18n;
    return [
    {
        label: app.getName(),
        submenu: [
            {
                label: i18n("About ${0}", [app.getName()]),
                selector: 'orderFrontStandardAboutPanel:'
            },
            {
                type: 'separator'
            },
            {
                label: i18n("Settings…"),
                accelerator: 'Command+,',
                click: function() { app.emit("open_settings"); }
            },
            {
                type: 'separator'
            },
            {
                label: i18n("Services"),
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: i18n("Hide ${0}", [app.getName()]),
                accelerator: 'Command+H',
                selector: 'hide:'
            },
            {
                label: i18n("Hide Others"),
                accelerator: 'Command+Shift+H',
                selector: 'hideOtherApplications:'
            },
            {
                label: i18n("Show All"),
                selector: 'unhideAllApplications:'
            },
            {
                type: 'separator'
            },
            {
                label: i18n("Quit ${0}", [app.getName()]),
                accelerator: 'Command+Q',
                click: function() { app.quit(); }
            },
        ]
    },
    {
        label: i18n("View"),
        submenu: [
            {
                label: i18n("Reload"),
                accelerator: 'Command+R',
                click: function() { app.emit("reload"); }
            },
            {
                label: i18n("Toggle DevTools"),
                accelerator: 'F12',
                click: function() { app.emit("toggleDevTools"); }
            }
        ]
    },
    {
        label: i18n("Window"),
        submenu: [
            {
                label: i18n("Minimize"),
                accelerator: 'Command+M',
                selector: 'performMiniaturize:'
            },
            {
                label: i18n("Close"),
                accelerator: 'Command+W',
                selector: 'performClose:'
            },
            {
                type: 'separator'
            },
            {
                label: i18n("Bring All to Front"),
                selector: 'arrangeInFront:'
            },
        ]
    },
    {
        label: i18n("Help"),
        submenu: [
            {
                label: i18n("${0} Help", [app.getName()]),
                accelerator: 'Command+?',
                click: function() { app.emit("open_website", "http://github.com/Andr3as/ShortTags"); }
            }
        ]
    }
];}