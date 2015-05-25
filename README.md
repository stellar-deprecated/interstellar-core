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
* [`Intent`](#intent-class)

#### Services
* [`mcs-core.Config`](#mcs-coreconfig-service)
* [`mcs-core.IntentBroadcast`](#mcs-coreintentbroadcast-service)

#### Widgets
None.

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

`App` class extends `Module` class and provides helper methods for final MCS application that use other modules. It provides additional functionality like `ui-router`.

```js
import {App, mod as mcsCore} from "mcs-core";
import {mod as mcsLogin} from "mcs-login";
import {mod as mcsStellard} from "mcs-stellard";
import {mod as mcsSettings} from "mcs-settings";
import {mod as mcsStellarApi} from "mcs-stellar-api";

export const app = new App("mcs-stellar-client");

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
* `sendBroadcast(intent)` - to broadcast and `Intent`,
* `registerReceiver(type, broadcastReceiver)` - to register Broadcast Receiver of specific type.

## `mcs-core.Config` service

The Config service provides the system through which the client can retrieve configuration flags.  It provides a `get(configName)` to which clients can retrieve values.

Conceptually, an application's configuration presents itself as a simple nested json object.


### Retrieving values (using `get`)

Once you have an instance of the config service (using normal angular DI mechanisms), you may access any previously loaded configuration using a "slash separated" accessor string. For example, say the configuration data is the json object below:

```javascript
{
  "stellard": {
    "connections": {
      "prd": "live.stellar.org",
      "stg": "test.stellar.org"
    }
  }
}
```

You can retrieve the address for the production stellard node with `config.get("stellard/connections/prd")`

### Defining configuration values

While conceptually the config system presents itself as a nested json object, underneath the covers the configuration system is comprised of a ordered set of configuration layers.  Layers higher in the stack override layers lower in the stack.

Layers are added to the configuration system using `addLayer`. An example layer stack might consist of:
- "base" (the default config layer MCS will ship with)
- "app" (a specific apps default configuration)
- "dev/prd/stg" (enviroment specific configuration)
- "runtime" (configuration added during runtime)

See Config#get in config.unit-test


### Typed accessors (`getString`, `getArray`, `getObject`, `getNumber`, `getBoolean`)

In the spirit of failing fast, consumers of the config service can apply type restrictions to config variables, such that an exception will be thrown at the point of retrieval if the result is of the wrong type.  For example, given a config object of `{"foo": "bar"}`, executing the statement `config.getNumber("foo")` will throw an exception because the result ("bar") is a string.

### Getting all overlayed values using `getLayers()`

### relative configuration objects using `getNamespace()`
