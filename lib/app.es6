require('angular');
let { Module } = require("./module");

export class App extends Module {
  constructor(name) {
    super(name);
  }

  bootstrap(cb) {
    this.define();
    angular.element(document).ready(() => { 
      console.log("here");
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
  }
}