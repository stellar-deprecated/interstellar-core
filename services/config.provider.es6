import {Config} from "../lib/config";
import {cloneDeep, concat, merge, isArray} from 'lodash';

class ConfigProvider {
  constructor() {
    this.appConfig = {};
    this.modulesConfig = {};
  }

  addAppConfig(data) {
    this.appConfig = data;
  }

  addModuleConfig(moduleName, data) {
    this.modulesConfig[moduleName] = data;
  }

  $get() {
    let config = cloneDeep(this.appConfig);
    if (!config.modules) {
      config.modules = {};
    }

    for (let module in this.modulesConfig) {
      if (!config.modules[module]) {
        config.modules[module] = this.modulesConfig[module];
      } else {
        merge(
          config.modules[module],
          this.modulesConfig[module],
          (a, b) => isArray(a) ? concat(b) : undefined
        );
      }
    }
    return new Config(config);
  }
}

module.exports = function(mod) {
  mod.provider("Config", ConfigProvider);
};
