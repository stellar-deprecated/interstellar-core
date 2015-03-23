import * as _ from "lodash";

global.injectNg = function(modName, objectMap) {
  beforeEach(angular.mock.module(modName));

  let injections = _.pairs(objectMap);
  
  let injectFn = function(...values) {
    for(let i = 0; i < values.length; i++) {
      let name = injections[i][0];
      let value = values[i];
      this[name] = value;
    }
  };
  injectFn.$inject = _.map(injections, _.last);

  beforeEach(inject(injectFn));
};


