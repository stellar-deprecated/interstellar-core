let _ = require("lodash");

class WidgetResolutionService {
  constructor() {
    this.resolvers = [];
  }

  addResolver(resolver) {
    this.resolvers.push(resolver);
  }

  resolve(type) {
    var resolved = []
    _.reduce(this.resolvers, function (result, resolver,index) {
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

module.exports = WidgetResolutionService;

