export {App}    from "./lib/app";
export {Module} from "./lib/module";
export {Config} from "./lib/config";
export {Intent} from "./lib/intent-system/intent";

export {Inject}     from "./lib/annotations/inject";
export {Controller} from "./lib/annotations/controller";
export {Service}    from "./lib/annotations/service";
export {Provider}   from "./lib/annotations/provider";
export {Widget}     from "./lib/annotations/widget"

const {Module} = require('./lib/module');

const mod = new Module('interstellar-core');
export default mod;

mod.services   = require.context("./services", true);
mod.directives = require.context("./directives", true);

mod.define();

export * from "./errors";

export let util = require('./lib/util');
