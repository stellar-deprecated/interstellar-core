import * as _ from "lodash";
import {Config} from "../lib/config.es6";
import {Service} from "../lib/annotations/service";
const intentTypes = require('../lib/intent-system/intent-types.json');

@Service('IntentBroadcast')
export default class IntentBroadcastService {
  constructor() {
    this.receivers = {};
    _.forEach(intentTypes, intentType => {
      this.receivers[intentType] = [];
    });
  }

  registerReceiver(intentType, broadcastReceiver) {
    if (!_.contains(intentTypes, intentType)) {
      throw new Error('Unknown intent type.');
    }
    this.receivers[intentType].push(broadcastReceiver);
  }

  registerGlobalReceiver(broadcastReceiver) {
    _.forEach(intentTypes, intentType => {
      this.receivers[intentType].push(broadcastReceiver);
    });
  }

  sendBroadcast(intent) {
    _.forEach(
      this.receivers[intent.type],
      receiver => receiver(intent)
    );
  }
}
