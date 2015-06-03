require('angular');
require("angular-ui-router");

let _                       = require("lodash");
let { Module }              = require("./module");
let {AngularNamespacer}     = require("./angular-namespacer");

export class App extends Module {
  constructor(name, config = {}) {
    super(name);
    this.configObject = config;
    this.routes = (state) => {};
    this.use('ui.router');
    this.widgetResolvers = [];
  }

  addWidgetResolver(resolver) {
    this.widgetResolvers.push(this.name + "." + resolver);
  }

  bootstrap(cb) {
    this.define();
    angular.element(document).ready(() => {
      angular.bootstrap(document, [this.name]);

      if(typeof cb === 'function') {
        cb();
      }
    });
  }

  define() {
    super.define();

    let loadConfig = (ConfigProvider) => {
      ConfigProvider.addAppConfig(this.configObject);
    };

    loadConfig.$inject = ["interstellar-core.ConfigProvider"];
    this.config(loadConfig);

    let loadRoutes = ($stateProvider, $urlRouterProvider) => {
      $urlRouterProvider.otherwise("/");
      this.routes($stateProvider);
    };

    loadRoutes.$inject = ["$stateProvider", "$urlRouterProvider"];
    this.config(loadRoutes);

    this._loadFunctions();
    this._loadWidgetResolvers(this.amod);
  }

  _loadWidgetResolvers(amod) {
    _.forEach(this.widgetResolvers, function (resolver) {
      let loadResolver = (resolver, WidgetResolutionService) => {
        WidgetResolutionService.addResolver(resolver);
      };

      loadResolver.$inject = [resolver, "interstellar-core.WidgetResolutionService"];
      amod.run(loadResolver);
    });
  }
}
