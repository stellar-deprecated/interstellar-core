let { AngularNamespacer } = require("mcs/angular-namespacer");

describe("AngularNamespacer#run", directDelegationTest("run"));
describe("AngularNamespacer#config", directDelegationTest("config"));
describe("AngularNamespacer#controller", subnameTest("controller"));
describe("AngularNamespacer#directive", subnameTest("directive"));
describe("AngularNamespacer#provider", subnameTest("provider"));
describe("AngularNamespacer#service", subnameTest("service"));
describe("AngularNamespacer#factory", subnameTest("factory"));
describe("AngularNamespacer#value", subnameTest("value"));

function setup() {
  beforeEach(function() {
    this.amod = angular.module("subname", []);
    this.mock = this.sinon.mock(this.amod);
    this.subject = new AngularNamespacer(this.amod);
  });
}

function directDelegationTest(method) {
  return function(){
    setup();

    it("delegates to the underlying module", function() {
      let fn = () => { };
      this.mock.expects(method).once().withArgs(fn);
      this.subject[method](fn);
      this.mock.verify();
    });
  };
}

function subnameTest(method) {
  return function(){
    setup();

    it("delegates to the underlying module", function() {
      let fn = () => { };
      this.mock.expects(method).once().withArgs("subname.name", fn);
      this.subject[method]("name", fn);
      this.mock.verify();
    });
  };
}
