let { Module } = require("mcs");

describe("Module#constructor", function(){
  let mod = new Module("sample-name");

  it("sets the name", function(){
    expect(mod.name).to.eql("sample-name");
  });

  it("initializes the uses array to []", function(){
    expect(mod.uses).to.eql([]);
  });
});

describe("Module#use", function(){
  let mod = new Module("sample-name");

  it("adds the name provided onto the uses array", function(){
    mod.use("foo");
    mod.use("bar");
    expect(mod.uses).to.eql(["foo", "bar"]);
  });
});

describe("Module#define", function(){
  let mod = new Module("sample-name");

  it("adds an angular module", function(){
    mod.define();
    expect(angular.module("sample-name")).to.be.ok();
  });
});