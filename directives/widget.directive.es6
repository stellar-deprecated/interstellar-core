class Widget {
  constructor($compile) {
    let directiveDefinitionObject = {
      restrict: "E",
      scope: {
        "data": "="
      },
      link: function(scope, element, attrs) {
        var templateName;
        if (attrs.name) {
          templateName = attrs.name;
        } else if (attrs.type) {
          //templateName = WidgetResolutionService.resolve(attrs.type);
        }
        var template = "<"+templateName+"></"+templateName+">";
        var compiled = $compile(template)(scope);

        element.append(compiled);
      }
    };

    return directiveDefinitionObject;
  }
}

Widget.$inject = ["$compile"];

module.exports = function(mod) {
  mod.directive("widget", Widget);
};