let _ = require('lodash');
const intentTypes = require('../intent-system/intent-types.json');

export class Intent {
  constructor(type, data) {
    if (!_.contains(intentTypes, type)) {
      throw new Error('Unknown intent type.');
    }
    this._type = type;
    this._data = data;
  }

  get type() {
    return this._type;
  }

  get data() {
    return _.cloneDeep(this._data);
  }

  static get TYPES() {
    return intentTypes;
  }
}
