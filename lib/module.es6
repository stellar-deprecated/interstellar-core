let {AngularNamespacer} = require("./angular-namespacer");
let { extname }         = require('path');
let _                   = require("lodash");

export class Module {
  constructor(name) {
    this.name = name;
    this.uses = [];
    this.runFunctions = [];
    this.configFunctions = [];
  }

  use(module) {
    if (_.isString(module)) {
      this.uses.push(module);
    } else if (_.isObject(module) && _.isString(module.name)) {
      this.uses.push(module.name);
    } else {
      throw new Error('Invalid module name/object.');
    }
  }

  define() {
    this.amod  = angular.module(this.name, this.uses);
    let amodd = new AngularNamespacer(this.amod);

    this._loadSetupBlocks(amodd);
    this._loadTemplates(amodd);
    this._loadAngularArtifacts(amodd, this.services);
    this._loadAngularArtifacts(amodd, this.controllers);
    this._loadAngularArtifacts(amodd, this.directives);
    this._loadAngularArtifacts(amodd, this.filters);
    this._loadFunctions();
  }

  config(func) {
    this.configFunctions.push(func);
  }

  run(func) {
    this.runFunctions.push(func);
  }

  _loadFunctions() {
    _.forEach(this.configFunctions, func => this.amod.config(func));
    _.forEach(this.runFunctions, func => this.amod.run(func));

    this.configFunctions = [];
    this.runFunctions = [];
  }

  _loadSetupBlocks(amod) {
    let blocks = this._uniqueRequireAll(this.setupBlocks);
    blocks.forEach(([_, fn]) => {
      let phase = fn.phase || 'run';
      amod[phase](fn);
    });
  }

  _loadTemplates(amod)   {
    let makeTemplatePath = (path) => {
      // strip off the leading ./ and the trailing .template
      let stripped = path.slice("./".length, -(".template.html".length));
      return `${this.name}/${stripped}`;
    };

    let loadTemplates = (cache) => {
      let templates = this._uniqueRequireAll(this.templates);
      templates.forEach(([key, template]) => {
        let templatePath = makeTemplatePath(key);
        cache.put(templatePath, template);
      });
    };

    loadTemplates.$inject = ["$templateCache"];
    amod.run(loadTemplates);
  }

  _loadAngularArtifacts(amod, ctx) {
    let artifacts = this._uniqueRequireAll(ctx);
    artifacts.forEach(([_, fn]) => {
      if (fn.registerArtifact) {
        return fn.registerArtifact(amod);
      }
      return fn(amod);
    });
  }

  _uniqueRequireAll(ctx) {
    if(!ctx) { return []; }

    // The following pipeline takes a webpack context,
    // extracts the keys (of which each individual js file has multiple)
    // loads the modules behind those keys and then returns a unique list
    // of loaded modules.
    //
    // If we did not uniq the list, setup blocks, for example, would run
    // multiple times

    return _(ctx.keys())
      .map(k => [k, ctx(k)])
      .uniq(([_, mod]) => mod)
      .value();
  }
}
