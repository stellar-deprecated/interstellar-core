import { deepGet } from "./util";

export class ConfigLayer {
  constructor(source, data) {
    this.source = source;
    this.data   = data;
  }

  get(varName) {
    let result = deepGet(this.data, varName);

    if(typeof result === 'function') {
      return result();
    } else {
      return result;
    }
  }
}