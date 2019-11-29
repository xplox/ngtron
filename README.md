# NgTron

![Alt text](ngtron.png?raw=true "NGTron Logo")

Angular + Electron = :heart:

Angular CLI extension based on Schematics and Builders for building angular based electron applications.
This project uses the new architect API which is currently beta and will ship with angular 8 (so soon!).
**So you can only use this addon starting with angular 8!**

Ngtron will setup your angular workspace with the finest electron tools available. [Electron Builder](https://github.com/electron-userland/electron-builder) is added to package your projects for mac, windows and linux.
[Electron Reload](https://www.npmjs.com/package/electron-reload) is used to automatically reload your app while developing whenever you make code changes.


[![npm version](https://badge.fury.io/js/%40richapps%2Fngtron.svg)](https://www.npmjs.com/@richapps/ngtron)

## Usage

### Run app while developing (with hot reloading)
```bash
ng run <project>:build-electron -c <custom-configuration>
```
Builds the app and opens it in an electron window. Uses hot reloading whenever your code changes.
### Package your app
```bash
ng run <project>:package-electron -c <custom-configuration>
```
You can customize your build settings in the angular.json.
There you will find all the settings which you can use in electron-builder.

### Serve app in the browser
`ng run <project>:serve-electron`
This will serve your app in the browser even if you use node or electron apis. 
Example will follow.


