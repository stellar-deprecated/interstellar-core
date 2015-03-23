let stellarLib = require("stellar-lib");
require("mock-socket");

window.Websocket = window.MockSocket;
stellarLib.Server.websocketConstructor = () => MockSocket;

let scenarios = {};

// reset all mocked services
afterEach(function() {
  MockSocket.services = {};
});

/**
 * 
 * Establishes a mock websocket scenario for the current context.
 *
 * Provide a name as string to use a scenario previously established using
 * addMockSocketScenario.
 *
 * Provide an object with "path" and "scenario" keys to establish a one-off
 * mocked server.
 * 
 */
window.setupMockSocket = function(scenarioNameOrOptions) {
  beforeEach(function() {
    if (typeof scenarioNameOrOptions === "string") {
      scenarios[scenarioNameOrOptions]();
    } else {
      let { path, scenario } = scenarioNameOrOptions;
      let server = new MockServer(path);
      scenario(server);
    }
  });
};

/**
 * 
 * Create a named mock socket scenario.  Provide a name, path, 
 * and scenario function.  The scenario will be called with a MockServer
 * instance when the scenario is instantiated by a test context.
 * 
 */
window.addMockSocketScenario = function(options) {
  let { name, path, scenario } = options;

  scenarios[name] = function() {
    let server = new MockServer(path);
    scenario(server);
  };
};

addMockSocketScenario({
  name: "online",
  path: "wss://live.stellar.org:9001",
  scenario: server => {
    server.on('connection', c => {
      // send an online status
      c.send({type: "serverStatus", server_status: "full"});
    });
  }
});

addMockSocketScenario({
  name: "immediate-close",
  path: "wss://live.stellar.org:9001",
  scenario: server => {
    server.on('connection', c => {
      c.close();
    });
  }
});