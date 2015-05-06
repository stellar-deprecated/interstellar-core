let _ = require("lodash");

class WidgetResolutionService {
  constructor() {
    this.resolvers = [];
  }

  addResolver(resolver) {
    this.resolvers.push(resolver);
  }

  resolve(type) {
    var resolved = [];
    _.reduce(this.resolvers, (result, resolver) => {
        var widget = resolver.resolve(type);
        if (!widget) {
            return;
        } else {
            result.push(widget);
        }
    }, resolved);

    // TODO: do something more intelligent here
    return resolved[0];
  }
}

module.exports = function(mod) {
  //mod.provider("WidgetResolutionService", WidgetResolutionService);
};
