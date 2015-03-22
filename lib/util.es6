import { reduce } from "lodash";

/**
 * Accesses a value from a deeply nested object
 * 
 * @param  {object} data [description]
 * @param  {string} path [description]
 * @return {object}      [description]
 */
export function deepGet(data, path) {
  let parts   = path.split("/");
  let getPart = (obj, part) => {
    if(typeof obj === 'object') {
      return obj[part];
    }
  };

  return reduce(parts, getPart, data);
  
}

/**
 * Angular DI helper
 * 
 * @param  {string} d Name of the dependency
 * @return {object}   The object as resolved through 
 *                    the angular dependency system
 */
window.$get = function(d) {
  return angular.element(document).injector().get(d);
};