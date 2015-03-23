let sinon     = require("sinon");
let chai      = require("chai");
let sinonChai = require("sinon-chai");
chai.use(sinonChai);

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function() {
  this.sinon.restore();
});