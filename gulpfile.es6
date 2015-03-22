global.gulp   = require("gulp");
global.$      = require("gulp-load-plugins")();
global.__root = __dirname;
global.cli    = require("./cli/cli");
require('colors');

require("./cli/testing");
require("./cli/building");
require("./cli/cleaning");
require("./cli/serving");
require("./cli/deploying");
require("./cli/installing");

gulp.task("default", ["test"]);
gulp.task("develop", ["serve-watch"]);