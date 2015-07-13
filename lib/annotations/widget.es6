import {extend} from 'lodash';

export function Widget(directiveName, controllerName, templateName, directiveOpts = {}) {
  if (!directiveName) {
    throw new Error('Widget directive name is empty.');
  }

  if (!controllerName) {
    throw new Error('Widget controller name is empty.');
  }

  if (!templateName) {
    throw new Error('Widget template name is empty.');
  }

  return function decorator(target) {
    if (target.registerArtifact) {
      throw new Error('registerArtifact is reserved Interstellar method name.');
    }

    target.registerArtifact = (mod) => {
      mod.controller(controllerName, target);

      let directive = function () {
        return extend(directiveOpts, {
          restrict: "E",
          templateUrl: templateName
        });
      };
      mod.directive(directiveName, directive);
    }
  }
}
