require('angular');
require("angular-ui-router");

let _                       = require("lodash");

let { Module }              = require("./module");
let Widget                  = require("./widget-directive");
let WidgetResolutionService = require("./widget-resolution-service");
let {AngularNamespacer}     = require("./angular-namespacer");

export class App extends Module {
  constructor(name) {
    super(name);
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
    super();

    let loadRoutes = (state, url) => {
      url.otherwise("/");
      this.routes(state);
    };

    loadRoutes.$inject = ["$stateProvider", "$urlRouterProvider"];
    this.amod.config(loadRoutes);
    this.amod.directive("widget", Widget);
    this.amod.service("WidgetResolutionService", WidgetResolutionService);

    this._loadWidgetResolvers(this.amod);
  }

  _loadWidgetResolvers(amod) {
    _.forEach(this.widgetResolvers, function (resolver) {
      let loadResolver = (resolver, WidgetResolutionService) => {
        WidgetResolutionService.addResolver(resolver);
      }

      loadResolver.$inject = [resolver, "WidgetResolutionService"];
      amod.run(loadResolver);
    });
  }
}