#Project Status

This project is still beta. Please open an issue to report any problems.

**To be part of the beta test go to [Google Play](https://play.google.com/apps/testing/de.andrano.mobilebattery) and sign on.**

#MobileBattery

Monitor your mobile battery level in the tray of your pc.

##Run the app

###Users

Download the app for your system [here](https://github.com/Andr3as/MobileBattery/releases), sign on for the [beta test](https://play.google.com/apps/testing/de.andrano.mobilebattery)
and download the app for your phone [here](https://play.google.com/store/apps/details?id=de.andrano.mobilebattery)

1. Download the pc app: https://github.com/Andr3as/MobileBattery/releases
2. Sign on for the beta test: https://play.google.com/apps/testing/de.andrano.mobilebattery
3. Download the Android app: https://play.google.com/store/apps/details?id=de.andrano.mobilebattery

###Developers

1. Download the code
2. Run `npm install`
3. Have fun and code
4. Download Electron from [here](https://github.com/atom/electron/releases)
5. Run the app
	- on Linux: `./electron/electron ./`
	- on OS X:  `./Electron.app/Contents/MacOS/Electron ./`
	- [Details](https://github.com/atom/electron/blob/master/docs/tutorial/quick-start.md#run-your-app)

6. Distribution
	- Copy content into Electron
		- on Windows/Linux: `electron/resources/app`
		- on OS X: `Electron.app/Contents/Resources/app/`
	- Rebrand the app
		- on Windows: Use rcedit or ResEdit
		- on Linux: Rename the executable
		- on OS X: Rename `CFBundleDisplayName`, `CFBundleIdentifier` and `CFBundleName` in `Electron.app/Contents/Info.plist`
	- [Details](https://github.com/atom/electron/blob/master/docs/tutorial/application-distribution.md)


##Credits

- [body-parser](https://github.com/expressjs/body-parser): MIT license
- [Bootstrap](http://getbootstrap.com): MIT license
- [bootstrap-select](https://github.com/silviomoreto/bootstrap-select): MIT license
- [CSS spinners](http://codepen.io/zessx/pen/RNPKKK): MIT license
- [Electron](https://github.com/atom/electron): MIT license
- [express](https://github.com/strongloop/express): MIT license
- [jQuery](http://jquery.com): MIT license
- [qr-image](https://github.com/alexeyten/qr-image): MIT license
- [svg2png](https://github.com/domenic/svg2png): WTFPL license
- [Zbar](http://zbar.sourceforge.net): GNU LGPL 2.1

####Images

- [Full battery status by Icon Works from flaticon.com](http://www.flaticon.com/free-icon/full-battery-status_63332): CC BY 3.0
- [Battery with a bolt by Freepik symbol from flaticon.com](http://www.flaticon.com/free-icon/battery-with-a-bolt-symbol_46518): CC BY 3.0
- [WiFi signal by Freepik from flaticon.com](http://www.flaticon.com/free-icon/wifi-signal_61692): CC BY 3.0

##License

MobileBattery is released under MIT license. 