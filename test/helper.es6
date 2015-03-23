require("6to5/polyfill");
global.expect = require("chai").expect;

require("angular");
require("angular-mocks/angular-mocks");

mocha.ui('lazy-bdd');

require("./support/add-inject-helpers");
require("./support/add-sinon");
require("./support/add-mock-socket");
require("./support/replace-q");

//use webpacks `require.context` to load all unit-test files
//we use this method instead of karma's `files` config because 
//it was causing duplicate requires (such as loading angular 3 times) 
//and causing all sorts of havoc.

loadContext(require.context("../modules", true, /unit-test.es6$/));
loadContext(require.context("./mcs", true, /unit-test.es6$/));

function loadContext(ctx) {
  ctx.keys().forEach(ctx);
}