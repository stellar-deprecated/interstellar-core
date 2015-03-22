import { ConfigLayer } from "../lib/config-layer";

describe("ConfigLayer#constructor", function(){
  let source = "some source";
  let data   = {foo: 3};
  subject( () =>  new ConfigLayer(source, data) );

  it("assigns the source correctly", function(){
    expect(this.subject.source).to.eql(source);
  });

  it("assigns the data correctly", function(){
    expect(this.subject.data).to.eql(data);
  });
});

describe("ConfigLayer#get", function(){
  subject(() => {
   return new ConfigLayer("blah", {
      simple: 1,
      fun: () => 2,
      nested: {
        simple: 3,
        fun: () => 4,
      } 
    });
  });

  context("when the keyPath exists and is a simple value", function(){
    it("returns the proper value", function(){
      expect(this.subject.get("simple")).to.eql(1);
      expect(this.subject.get("nested/simple")).to.eql(3);
    });
  });

  context("when the keyPath exists and is a function", function(){
    it("returns the result of the function", function(){
      expect(this.subject.get("fun")).to.eql(2);
      expect(this.subject.get("nested/fun")).to.eql(4);
    });
  });

  context("when the keyPath does not exist", function(){
    it("returns undefined", function(){
      expect(this.subject.get("noexist")).to.be.undefined();
      expect(this.subject.get("noexist/nothere")).to.be.undefined();
    });
  });
});