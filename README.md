`interstellar-core`
=============

The `interstellar-core` module is part of the [Interstellar Module System](https://github.com/stellar/interstellar).

It provides the lowest level functionality: a core JS wrapper. 

> Quick start to developing in the Interstellar eco-system:
>
> * Read [`Getting started`](https://github.com/stellar/interstellar/tree/master/docs) doc.
> * Install [`interstellar-workspace`](https://github.com/stellar/interstellar-workspace).
> * Contribute to our [open-source modules](https://github.com/stellar/interstellar/blob/master/docs/module-list.md) or develop your own.

## Module contents

#### Classes
* [`Module`](#module-class)
* [`App`](#app-class)
* [`Inject` annotation](#inject-annotation)
* [`Controller` annotation](#controller-annotation)
* [`Provider` annotation](#provider-annotation)
* [`Service` annotation](#service-annotation)
* [`Widget` annotation](#widget-annotation)
* [`Intent`](#intent-class)

#### Services
* [`interstellar-core.IntentBroadcast`](#interstellar-coreintentbroadcast-service)
* [`interstellar-core.Config`](#interstellar-coreconfig-service)

#### Widgets
None.

#### Others
* [`solar`](https://github.com/stellar/solar)
* [`solar-stellarorg`](https://github.com/stellar/solar-stellarorg)

## `Module` class

Module is a wrapper around [Angular.js module](https://docs.angularjs.org/guide/module). Every Interstellar module is a `Module` object and Angular.js module. `Module` provides several methods to help configure a module. It also provides autoloading support for controllers, templates, services, directives and other components.

```js
import {Module} from "interstellar-core";

export const mod = new Module('interstellar-example');
mod.use(interstellarSomeModule.name);

mod.controllers = require.context("./controllers", true);
mod.directives  = require.context("./directives", true);
mod.services    = require.context("./services", true);
mod.templates   = require.context("raw!./templates", true)

mod.define();
```

## `App` class

`App` class extends `Module` class and provides helper methods for the final Interstellar application that use other modules. It provides additional functionality like `ui-router`. The second parameter in a constructor is [a configuration JSON](#interstellar-coreconfig-service).

```js
import {App, mod as interstellarCore} from "interstellar-core";
import {mod as interstellarStellarWallet} from "interstellar-stellar-wallet";
import {mod as interstellarNetwork} from "interstellar-network";
import {mod as interstellarSettings} from "interstellar-settings";
import {mod as interstellarStellarApi} from "interstellar-stellar-api";

let config = require('./config.json');
export const app = new App("interstellar-stellar-client", config);

app.use(interstellarCore.name);
app.use(interstellarStellarWallet.name);
app.use(interstellarNetwork.name);
app.use(interstellarSettings.name);
app.use(interstellarStellarApi.name);

app.templates   = require.context("raw!./templates", true);
app.controllers = require.context("./controllers",   true);

app.routes = ($stateProvider) => {
  $stateProvider.state('login', {
    url: "/login",
    templateUrl: "interstellar-stellar-client/login"
  });
  $stateProvider.state('dashboard', {
    url: "/dashboard",
    templateUrl: "interstellar-stellar-client/dashboard",
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

## `Inject` annotation

[Decorator](https://github.com/wycats/javascript-decorators) class to inject dependencies to your controllers or services using AngularJS injector subsystem:

```js
import {Inject} from 'interstellar-core';

@Inject("interstellar-sessions.Sessions", "interstellar-network.Server")
class ReceiveWidgetController {
  constructor(Sessions, Server) {
    this.Server = Server;
    this.Sessions = Sessions;
  }
}
```

## `Controller` annotation

[Decorator](https://github.com/wycats/javascript-decorators) class to annotate your controllers.

```js
import {Controller, Inject} from 'interstellar-core';

@Controller("HeaderController")
@Inject("interstellar-sessions.Sessions", "interstellar-network.Server")
export default class HeaderController {
  constructor(Sessions, Server) {
    this.Server = Server;
    this.Sessions = Sessions;
  }
  // ...
}
```

> **Heads up!** Annotated class _must_ be exported as `default`.

## `Provider` annotation

[Decorator](https://github.com/wycats/javascript-decorators) class to annotate your providers.

```js
import {Provider} from 'interstellar-core';

@Provider("Config")
export default class ConfigProvider {
  constructor() {
    this.appConfig = {};
    this.modulesConfig = {};
  }
  // ...
}
```

> **Heads up!** Annotated class _must_ be exported as `default`.

## `Service` annotation

[Decorator](https://github.com/wycats/javascript-decorators) class to annotate your services.

```js
import {Service} from 'interstellar-core';

@Service('IntentBroadcast')
export default class IntentBroadcastService {
  constructor() {
    this.receivers = {};
  }
  // ...
}
```

> **Heads up!** Annotated class _must_ be exported as `default`.

## `Widget` annotation

[Decorator](https://github.com/wycats/javascript-decorators) class to annotate your widgets' controllers.

This annotation requires 3 arguments:
* directive name,
* controller name,
* template name.

```js
import {Widget, Inject} from 'interstellar-core';

@Widget("balance", "BalanceWidgetController", "interstellar-network-widgets/balance-widget")
@Inject("$scope", "interstellar-sessions.Sessions", "interstellar-network.AccountObservable", "interstellar-network.Server")
export default class BalanceWidgetController {
  constructor($scope, Sessions, AccountObservable, Server) {
    if (!Sessions.hasDefault()) {
      console.error('No session. This widget should be used with active session.');
      return;
    }
    // ...
  }
  // ...
}
```

> **Heads up!** Annotated class _must_ be exported as `default`.

## `Intent` class

Modules in Interstellar communicate by broadcasting `Intent` objects using [Android-inspired](http://developer.android.com/guide/components/intents-filters.html) intent system. Modules can:
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

## `interstellar-core.IntentBroadcast` service

`interstellar-core.IntentBroadcast` service is responsible for delivering `Intent`s to correct Broadcast Receivers. It has two methods:
* `sendBroadcast(intent)` - to broadcast an `Intent`,
* `registerReceiver(type, broadcastReceiver)` - to register Broadcast Receiver of specific type.

## `interstellar-core.Config` service

The Config service provides the system through which the client can retrieve configuration flags. It provides a `get(configName)` to which clients can retrieve values.

Conceptually, an application's configuration presents itself as a simple nested json object.

### Defining configuration values

`interstellar-core.Config` provider has 2 methods that `App` and `Module`s can use to define configuration values:
* `addAppConfig(config)` - used by [`App`](#app-class)
* `addModuleConfig(moduleName, config)` - used by [`Module`](#module-class)s

All config values added by modules are treated as default values that can be overwritten by the `App` config. For example, let's say [`interstellar-network`](https://github.com/stellar/interstellar-network) module adds following config JSON using `addModuleConfig`:
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
    "interstellar-network": {
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

Getting configuration values in [`Module`](#module-class) is a little different. During configuration phase all modules' configurations are appended to `modules` object in the main config JSON. For example, let's say [`interstellar-network`](https://github.com/stellar/interstellar-network) module adds following configuration:
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
let hostname = Config.get("modules.interstellar-network.horizon.hostname");
```

### Typed accessors (`getString`, `getArray`, `getObject`, `getNumber`, `getBoolean`)

In the spirit of failing fast, consumers of the config service can apply type restrictions to config variables, such that an exception will be thrown at the point of retrieval if the result is of the wrong type.  For example, given a config object of `{"foo": "bar"}`, executing the statement `Config.getNumber("foo")` will throw an exception because the result ("bar") is a string.

