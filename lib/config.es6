import { ConfigLayer } from "./config-layer";
import { InvalidConfigTypeError } from "../errors";
let _ = require("lodash");

export class Config {
  constructor() {
    this.layers = [];
  }

  addLayer(source, data) {
    this.layers.unshift(new ConfigLayer(source, data));
  }

  getLayers(varName) {
    return this.layers.map(layer => {
      let source = layer.source;
      let value = layer.get(varName);
      return {source, value};
    });
  }

  get(varName) {
    let layerResults = this.getLayers(varName);
    let result = layerResults.find(({layer, value}) => {
      return typeof value !== 'undefined';
    });

    if(result) {
      return _.cloneDeep(result.value);
    }
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