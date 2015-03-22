`mcs-core` Module
=============

The mcs-core module provides the lowest level functionality within the modular client system.

## `mcs-core.Config` Service

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

## Guides

The [guides](guides) directory of this git repository contains a set of development guides to help you work within the MCS.