require('angular');
require("angular-ui-router");

let _                       = require("lodash");
let { Module }              = require("./module");
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
    super.define();

    let loadRoutes = ($stateProvider, $urlRouterProvider) => {
      $urlRouterProvider.otherwise("/");
      this.routes($stateProvider);
    };

    loadRoutes.$inject = ["$stateProvider", "$urlRouterProvider"];

    let goToMainStateWithoutSession = (Sessions, $state, $rootScope) => {
      $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
        if (toState.requireSession && !Sessions.hasDefault()) {
          event.preventDefault();
          $state.transitionTo('index');
        }
      })
    };

    goToMainStateWithoutSession.$inject = ["mcs-stellard.Sessions", "$state", "$rootScope"];

    this.config(loadRoutes);
    this.run(goToMainStateWithoutSession);

    this._loadFunctions();
    this._loadWidgetResolvers(this.amod);
  }

  _loadWidgetResolvers(amod) {
    _.forEach(this.widgetResolvers, function (resolver) {
      let loadResolver = (resolver, WidgetResolutionService) => {
        WidgetResolutionService.addResolver(resolver);
      };

      loadResolver.$inject = [resolver, "mcs-core.WidgetResolutionService"];
      amod.run(loadResolver);
    });
  }
}