Building and Packaging products in the MCS
==========================================

The build system in the MCS is used to produce packages of content 

## Buzzwords

- gulp
- gulp-load-plugins
- webpack
- gulp-filter, gulp-rename, gulp-replace

## Quick Start 

After having successfully cloned the MCS, simply run `gulp build --app APP`, where `APP` is one of the directories inside the `/apps` folder.  Doing so will compile the project and put the resulting build into `dist/APP`, which you are then free to package or deploy into your own infrastructure.

## Build Process Details

The core of our build process is [webpack](http://webpack.github.io/) and we use it to express all of the dependencies between our individual pieces of code.  Webpack gets run at the outset of each build process and produces a set of files into `.tmp/APP/webpacked`.

After we have a webpacked version (which should be fully functional if you open `.tmp/APP/webpacked/index.html`), the next step is to produce the "hashed" build.  A hashed build bundles the output files into a subdirectory that is named from the content hash of the main javascript bundle:  The assumption is that the main bundle's hash is a reasonable stand in for the hash of the entire bundle.  In the future, we should probably just hash all of the content.

After we move all files except the `index.html` into the hashed folder, we then replace a special comment in the `index.html` file with an html `base` element pointing to that hashed folder.  Let me illustrate.  Say you have a build folder that looks like this:

```
index.html
main.bundle.js
main.bundle.js.map
main.bundle.css
main.bundle.css.map
```

and index.html has the content:

```html
<!doctype html>
<html>
<head>
  <!-- mcs:content-base -->
  <link rel="stylesheet" href="main.bundle.css" />
  <script src="main.bundle.js"></script>
</head>
...
</html>
```

After the build process, you'll get a directory that looks like:

```
index.html
ff122ed5/main.bundle.js
ff122ed5/main.bundle.js.map
ff122ed5/main.bundle.css
ff122ed5/main.bundle.css.map
```

and index.html will then look like:

```html
<html>
<head>
  <base href="ff122ed5/">
  <link rel="stylesheet" href="main.bundle.css" />
  <script src="main.bundle.js"></script>
</head>
...
</html>
```

Finally, after we have the "hashed" build (which can be found in `.tmp/hashed/APP`) we copy that whole folder into `dist/APP`, which is the final build.

## Building for Production

Building for production involves simply adding `--env prd` onto your build command.  This will activate any production specific build configurations for webpack, and will also make sure that the appropriate configuration files are bundled with the resultant build.

## Globals

The build scripts set a number of global variables in an attempt to improve the amount of significant code in each individual build file. You can see these at the top of `gulpfile.es6`.  Some notes on what those globals are:

- `cli` is a distilled set of command line arguments such as `app` and `env`
- `gulp` is an instance of gulp
- `$` this is all of the loaded gulp plugins. 
- `__root` is the base mcs directory 

## Extending the build system

TODO

### A webpack primer

TODO
