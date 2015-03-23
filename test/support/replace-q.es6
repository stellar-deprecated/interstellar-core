let _ = require('lodash');
let Q = require('q');

global.dontUseAngularQ = function() {
  beforeEach(function() {
    angular.mock.module($provide => {
        $provide.value('$q', Q); 
    });
  });
};