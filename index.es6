export {App}    from "./lib/app.es6";
export {Module} from "./lib/module.es6";
export {Config} from "./lib/config.es6";
export {Intent} from "./lib/intent-system/intent.es6";
export {Inject} from "./lib/decorators/inject.es6";

const {Module} = require('./lib/module');

const mod = new Module('mcs-core');
export default mod;

mod.services   = require.context("./services", true);
mod.directives = require.context("./directives", true);

mod.define();

export * from "./errors";

export let util = require('./lib/util');
