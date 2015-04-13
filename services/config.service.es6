import {Config} from "../lib/config";

class ConfigProvider {
  constructor() {
    this.layers = [];
  }

  addLayer(source, data) { 
    this.layers.unshift({source, data});
  }

  $get() {
    let result = new Config();

    this.layers.forEach(({source, data}) => {
      result.addLayer(source, data);
    });

    return result;
  }
}

module.exports = function(mod) {
  mod.provider("Config", ConfigProvider);
};
