`mcs-core`
=============

The `mcs-core` is part of the Modular Client System.

> Quick start to developing in the MCS eco-system:
>
> * Install [`mcs-workspace`](https://github.com/stellar/mcs-workspace).
> * Read the technical overview of the system.
> * Contribute to our open-source modules or develop your own.

The `mcs-core` module provides the lowest level functionality within the modular client system.

## Module contents

#### Classes
* [`Module`](#module-class)
* [`App`](#app-class)
* [`Inject` decorator](#inject-decorator)
* [`Intent`](#intent-class)

#### Services
* [`mcs-core.IntentBroadcast`](#mcs-coreintentbroadcast-service)
* [`mcs-core.Config`](#mcs-coreconfig-service)

#### Widgets
None.

#### Others
* [`kelp`](https://github.com/stellar/kelp)
* [`kelp-theme-sdf`](https://github.com/stellar/kelp-theme-sdf)

## `Module` class

Module is a wrapper around [Angular.js module](https://docs.angularjs.org/guide/module). Every MCS module is a `Module` object and Angular.js module. `Module` provides several methods to help configure a module. It also provides autoloading support for controllers, templates, services, directives and other components.

```js
import {Module} from "mcs-core";

export const mod = new Module('mcs-example');
mod.use(mcsSomeModule.name);

mod.controllers = require.context("./controllers", true);
mod.directives  = require.context("./directives", true);
mod.services    = require.context("./services", true);
mod.templates   = require.context("raw!./templates", true)

mod.define();
```

## `App` class

`App` class extends `Module` class and provides helper methods for the final MCS application that use other modules. It provides additional functionality like `ui-router`. The second parameter in a constructor is [a configuration JSON](#mcs-coreconfig-service).

```js
import {App, mod as mcsCore} from "mcs-core";
import {mod as mcsLogin} from "mcs-login";
import {mod as mcsStellard} from "mcs-stellard";
import {mod as mcsSettings} from "mcs-settings";
import {mod as mcsStellarApi} from "mcs-stellar-api";

let config = require('./config.json');
export const app = new App("mcs-stellar-client", config);

app.use(mcsCore.name);
app.use(mcsLogin.name);
app.use(mcsStellard.name);
app.use(mcsSettings.name);
app.use(mcsStellarApi.name);

app.templates   = require.context("raw!./templates", true);
app.controllers = require.context("./controllers",   true);

app.routes = ($stateProvider) => {
  $stateProvider.state('login', {
    url: "/login",
    templateUrl: "mcs-stellar-client/login"
  });
  $stateProvider.state('dashboard', {
    url: "/dashboard",
    templateUrl: "mcs-stellar-client/dashboard",
    requireSession: true
  });
  // ...
};

// Callbacks to execute in `config` block.
app.config(configureServices);

// Callbacks to execute in `run` block.
app.run(registerBroadcastReceivers);

app.bootstrap();
```

## `Inject` decorator

[Decorator](https://github.com/wycats/javascript-decorators) class to inject dependencies to your controllers or services using AngularJS injector subsystem:

```js
import {Inject} from 'mcs-core';

@Inject("mcs-stellard.Sessions", "mcs-stellard.Server")
class ReceiveWidgetController {
  constructor(Sessions, Server) {
    this.Server = Server;
    this.Sessions = Sessions;
  }
}
```

## `Intent` class

Modules in MCS communicate by broadcasting `Intent` objects using [Android-inspired](http://developer.android.com/guide/components/intents-filters.html) intent system. Modules can:
* **Broadcast Intents** to trigger some events in other modules,
* **Register Broadcast Receivers** to listen to Intents sent by other modules.

Every Intent has a type which must be one of standard intent types:
* `SEND_TRANSACTION` - User wants to send a transaction.
* `SHOW_DASHBOARD` - User wants to see a dashboard.
* `LOGOUT` - User wants to logout.

`Intent` can also contain additional data helpful for a Broadcast Receiver. For example, `SEND_TRANSACTION` Intent can contain destination address.

```js
// Sending Broadcast
IntentBroadcast.sendBroadcast(
  new Intent(
    Intent.TYPES.SEND_TRANSACTION,
    {destination: this.destination}
  )
);
// Receiving Broadcast
IntentBroadcast.registerReceiver(Intent.TYPES.SEND_TRANSACTION, intent => {
  widget.set('destinationAddress', intent.data.destination);
});
```

## `mcs-core.IntentBroadcast` service

`mcs-core.IntentBroadcast` service is responsible for delivering `Intent`s to correct Broadcast Receivers. It has two methods:
* `sendBroadcast(intent)` - to broadcast an `Intent`,
* `registerReceiver(type, broadcastReceiver)` - to register Broadcast Receiver of specific type.

## `mcs-core.Config` service

The Config service provides the system through which the client can retrieve configuration flags. It provides a `get(configName)` to which clients can retrieve values.

Conceptually, an application's configuration presents itself as a simple nested json object.

### Defining configuration values

`mcs-core.Config` provider has 2 methods that `App` and `Module`s can use to define configuration values:
* `addAppConfig(config)` - used by [`App`](#app-class)
* `addModuleConfig(moduleName, config)` - used by [`Module`](#module-class)s

All config values added by modules are treated as default values that can be overwritten by the `App` config. For example, let's say [`mcs-network`](https://github.com/stellar/mcs-network) module adds following config JSON using `addModuleConfig`:
```json
{
  "horizon": {
    "secure": true,
    "hostname": "horizon-testnet.stellar.org",
    "port": 443
  }
}
```
To overwrite this module's configuration, an app needs to add following config JSON using `addAppConfig`:
```json
{
  "modules": {
    "mcs-network": {
      "horizon": {
        "secure": false,
        "hostname": "horizon.example.com",
        "port": 80
      }
    }
  }
}
```

### Retrieving values (using `get`)

Once you have an instance of the config service (using normal angular DI mechanisms), you may access any previously loaded configuration using a "dot separated" accessor string. For example, say the [`App`](#app-class) configuration data is the json object below:

```json
{
  "horizon": {
    "secure": true,
    "hostname": "horizon-testnet.stellar.org",
    "port": 443
  }
}
```

You can retrieve the address for the horizon with:
```js
let hostname = Config.get("horizon.hostname");
```

Getting configuration values in [`Module`](#module-class) is a little different. During configuration phase all modules' configurations are appended to `modules` object in the main config JSON. For example, let's say [`mcs-network`](https://github.com/stellar/mcs-network) module adds following configuration:
```json
{
  "horizon": {
    "secure": true,
    "hostname": "horizon-testnet.stellar.org",
    "port": 443
  }
}
```

Now, you can retrieve the address for the horizon with:
```js
let hostname = Config.get("modules.mcs-network.horizon.hostname");
```

### Typed accessors (`getString`, `getArray`, `getObject`, `getNumber`, `getBoolean`)

In the spirit of failing fast, consumers of the config service can apply type restrictions to config variables, such that an exception will be thrown at the point of retrieval if the result is of the wrong type.  For example, given a config object of `{"foo": "bar"}`, executing the statement `Config.getNumber("foo")` will throw an exception because the result ("bar") is a string.

