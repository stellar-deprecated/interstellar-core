import {Config} from "../lib/config";
import {cloneDeep, concat, merge, isArray} from 'lodash';
import {Provider} from "../lib/annotations/provider";

@Provider("Config")
export default class ConfigProvider {
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
      config.modules[module] = this.modulesConfig[module];

      // App overwrites
      if (this.appConfig.modules && this.appConfig.modules[module]) {
        merge(
          config.modules[module],
          this.appConfig.modules[module],
          (a, b) => isArray(a) ? concat(b) : undefined
        );
      }
    }
    return new Config(config);
  }
}
