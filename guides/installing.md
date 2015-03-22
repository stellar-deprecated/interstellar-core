Installing
==========================================

## Why?

* Build our package registry/manager system.
* Separate MCS modules (both: SDF and remote folks) from MCS codebase.
* Separate apps' dependencies (Bower & NPM) from MCS dependencies.
* Allow simple access to modules' dependencies for build purposes (Bower).

## Idea

Consider we have an app that uses 4 MCS modules but also NPM and Bower dependencies. Each of those 4 modules has it's own NPM and Bower dependencies.

```
+---------------------+    +--------------------+  +---------------------+    +--------------------+
|                     | <--| package.json (NPM) |  |                     | <--| package.json (NPM) |
|                     |    +--------------------+  |                     |    +--------------------+
|    stellar/core     |                            |       bank/2fa      |                          
|                     |    +--------------------+  |                     |    +--------------------+
|                     | <--| bower.json (Bower) |  |                     | <--| bower.json (Bower) |
+---------------------+    +--------------------+  +---------------------+    +--------------------+

+---------------------+    +--------------------+  +---------------------+    +--------------------+
|                     | <--| package.json (NPM) |  |                     | <--| package.json (NPM) |
|                     |    +--------------------+  |                     |    +--------------------+
|    stellar/login    |                            |   bank/somemodule   |                          
|                     |    +--------------------+  |                     |    +--------------------+
|                     | <--| bower.json (Bower) |  |                     | <--| bower.json (Bower) |
+---------------------+    +--------------------+  +---------------------+    +--------------------+
```

In the current solution all modules are in `modules` directory and all modules' dependencies in two files: `bower.json` and `package.json`.

My idea is to move `modules` to the app directory (so each app has it's own modules) and merge dependencies (app and modules) into `bower.json` and `package.json` files but in the app directory. So the app directory will look like this:

```
apps
└── offline-signer
    ├── modules
    │   ├── stellar
    │   │   ├── core
    │   │   └── login
    │   └── bank
    │       ├── 2fa
    │       └── somemodule
    ├── bower_components
    │   └── ...
    └── node_modules
        └── ...
```

This solution solves following problems:

* User can create a set of apps that use different modules and different dependencies (especially different versions),
* Community/organizations can create reusable MCS modules which don't need to be merged with MCS repository (they don't need to merge it too now but they'd need to copy a module and update `package.json` and `bower.json` files manually),
* Modules have simple access to it's Bower and NPM dependencies (especially Bower dependencies which are in the one top-level app directory).

> **Heads up** One thing to note here is in this simple solution modules won't be able to depend on other modules (but obviously can have NPM/Bower dependencies).

## How it works?

To achieve this we need to:

1. Pull all modules to `modules` directory in the app folder,
2. Merge app Bower and NPM dependencies with all modules dependencies,
3. Install NPM and Bower dependencies.

Points 2 and 3 are simple (and done). To build a solution for point 1 we can leverage Github repositories and tags/versions. If a developer wants to create MCS module all she needs to do is to create a new public repo in her Github account. In this case package names will consist of `vendor/name` parts (like in [composer](https://getcomposer.org/doc/00-intro.md)) but because of it we won't have to build and maintain our own package registry.

We will probably want to standardize module directory structure (ex. we may need `widgets` directory for automatic widget loading).

#### app.json file

`app.json` file exists to define which MCS modules, Bower and NPM dependencies an app will be using.

For `offline-signer` app a file may look like this:

```json
{
  "modules": {
    "stellar/core": "0.0.1",
    "stellar/login": "0.0.1",
    "bank/2fa": "0.0.1",
    "bank/somemodule": "0.0.1"
  },
  "bower": {
    "bootstrap": "3.3.2",
    "normalize.css": "~3.0.2"
  },
  "npm": {
    "angular-ui-router": "^0.2.13",
    "jsqrcode": "0.0.6",
    "lodash": "^2.4.1",
    "q": "^1.1.2",
    "qr-image": "git://github.com/nullstyle/qr-image#iife-it",
    "stellar-lib": "^0.10.1"
  }
}
```

## Installing dependencies

Simply run `gulp install --app APP_NAME`. Dependencies will be installed in `APP_NAME` directory:

* MCS modules will be installed in `modules` directory,
* NPM dependencies will be installed in `node_modules` directory,
* Bower dependencies will be installed in `bower_components` directory.

Try it in this branch with:
```
gulp install --app offline-signer
gulp serve --app offline-signer
```
