#!/usr/bin/env node
var cwd = process.cwd();
var spawn = require('child_process').spawn;
var child = spawn(cwd+'/node_modules/mcs-core/node_modules/gulp/bin/gulp.js', [
  '--cwd', '.',
  '--gulpfile', 'node_modules/mcs-core/gulpfile.js'
].concat(process.argv.slice(2)), {stdio: 'inherit'});
