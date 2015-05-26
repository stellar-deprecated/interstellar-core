import {Config} from "../lib/config";
import {cloneDeep, extend} from 'lodash';

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
    for (let module in this.modulesConfig) {
      if (!config.modules[module]) {
        config.modules[module] = this.modulesConfig[module];
      } else {
        extend(config.modules[module], this.modulesConfig[module]);
      }
    }
    return new Config(config);
  }
}

module.exports = function(mod) {
  mod.provider("Config", ConfigProvider);
};
