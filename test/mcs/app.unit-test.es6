let { App } = require("mcs");

describe("App#bootstrap", function(){
  let app = new App("sample-name");
  //NOTE: we can't really test bootstrap because it depends upon document.ready
  //which never gets fired in the test context
});

describe("App#define", function(){
  let app = new App("sample-name");
  
  it("call the provided routing config script", function() {
    let called = true;
    app.routes = (state) => { called = true; };
    app.define();
    expect(called).to.eq(true);
  });

  it("doesn't explode", function() {
    app.define();
  });
});