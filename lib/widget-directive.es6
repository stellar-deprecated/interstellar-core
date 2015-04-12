class Widget {
  constructor($compile, WidgetResolutionService) {
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
          templateName = WidgetResolutionService.resolve(attrs.type);
        }
        var template = "<"+templateName+"></"+templateName+">";
        var compiled = $compile(template)(scope);

        element.append(compiled);


        //let [packageName, widgetName] = attrs.name.split('.');
        //console.log(`${packageName}/package.json`);
        ////let packageJson = require(`${packageName}/package.json`);
        //let packageJson = require(packageName);
        //console.log(packageJson);
        //
        ////let template = require('raw!./node_modules/');
        //let compiled = $compile(template)(scope);
        //
        //element.append(compiled);
      }
    };

    return directiveDefinitionObject;
  }
}

Widget.$inject = ["$compile", "WidgetResolutionService"];

module.exports = Widget;