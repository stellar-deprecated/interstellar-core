/**
 *
 * This class delegates angular "define" methods to the angular module it wraps,
 * but ensures that any named defines (such as controllers, services, or values)
 * incorporate the name of the module into its own name.
 *
 * so, given:
 *
 * ```javascript
 *   var mod = angular.module("foo", []);
 *   var modd = new AngularNamespacer(mod)
 *   modd.service("Foo", function() {})
 * ```
 *
 * would be the equivalent to:
 *
 * ```javascript
 *   var mod = angular.module("foo", []);
 *   mod.service("foo.Foo", function() {})
 * ```
 *
 */
export class AngularNamespacer {
  constructor(amod) {
    this.amod = amod;
  }

  run(val) {
    this.amod.run(val);
  }

  config(val) {
    this.amod.config(val);
  }

  controller(name, val) {
    this._define('controller', name, val);
  }

  directive(name, val) {
    this._define('directive', name, val);
  }

  provider(name, val) {
    this._define('provider', name, val);
  }

  service(name, val) {
    this._define('service', name, val);
  }

  factory(name, val) {
    this._define('factory', name, val);
  }

  value(name, val) {
    this._define('value', name, val);
  }

  _define(type, name, val) {
    let fullName = `${this.amod.name}.${name}`;
    this.amod[type](fullName, val);
  }
}
