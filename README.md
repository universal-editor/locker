# The locks component for "Universal Editor"

Module for "Universal Editor" which extends the possibility of adding a component `ue-locks`.

## Installing

This extension is pulled like a bower dependence. For connecting the extension required to execute
the following commands when you located in the root directory of the project:

* Bower install https://github.com/universal-editor/locker --save -F
* Required to make connecting javascript-file:
  * ue-locks.min.js – the main extension file in editor.

Connection module:

```javascript
    angular.module('myApp', ['universal-editor', 'ue-locks']);
```

For correct operation of the extensions editor requires a set of additional libraries that extend the functionality of AngularJS.
A current list of libraries and their version is available in bower.json of the file repository ("section" dependencies). If
extension connected via bower, then it will download the necessary libraries.

## Building

Recommendation: run console with Administrator permissions this will include address http://ue-locks.dev into host file and open it in browser.
If you don't run console this way, you may have to enter http://ue-locks.dev in host file manually at new line like this

127.0.0.1 ue-locks.dev

Install dependences:

1. `yarn install`
1. `bower install`

Run build:

* `npm run dev`: build and watch sources, create web server. 
* `npm run dev --prod`: build minified version and watch sources, create web server.
* `npm run build`: build to `./dist` directory.

## Documentation

* [Русский](docs/ru/README.md)
