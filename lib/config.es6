import {pick} from 'dot-object';
import {InvalidConfigTypeError} from "../errors";

export class Config {
  constructor(config) {
    this.config = config;
  }

  get(varName) {
    return pick(varName, this.config);
  }

  getString(varName)  { return this._getTyped(varName, 'string'); }
  getNumber(varName)  { return this._getTyped(varName, 'number'); }
  getBoolean(varName) { return this._getTyped(varName, 'boolean'); }
  getObject(varName)  { return this._getTyped(varName, 'object'); }

  getArray(varName)   {
    //NOTE: we cannot use the _getTyped helper because
    //typeof([]) === 'object', so we use instanceof instead

    let result = this.get(varName);

    if (!(result instanceof Array)) {
      throw new InvalidConfigTypeError(`${varName} is not an array`);
    }

    return result;
  }

  _getTyped(varName, type) {
    let result = this.get(varName);

    if (typeof result !== type) {
      throw new InvalidConfigTypeError(`${varName} is not a ${type}`);
    }

    return result;
  }
}
