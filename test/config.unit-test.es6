import { Config } from "../lib/config";
import { ConfigLayer } from "../lib/config";
import { InvalidConfigTypeError } from "../errors";

describe("Config#constructor", function(){
  subject(() => new Config());


  it("sets layers to an empty array", function(){
    expect(this.subject.layers).to.eql([]);
  });
});

describe("Config#addLayer", function(){
  subject(() => new Config());

  it("prepends to the layers array", function(){
    this.subject.addLayer("1", {});
    this.subject.addLayer("2", {});
    expect(this.subject.layers.length).to.eql(2);
    expect(this.subject.layers[0].source).to.eql("2");
    expect(this.subject.layers[1].source).to.eql("1");
  });
});

describe("Config#getLayers", function(){
  subject(() => new Config());

  context("when the config has no layers", function(){
    it("returns an empty array", function(){
      expect(this.subject.getLayers("foo")).to.eql([]);
      expect(this.subject.getLayers("foo/bar")).to.eql([]);
    });
  });

  context("when the config has one layer", function(){
    beforeEach(function() {
      this.subject.addLayer("base", {foo: 1});
    });

    it("returns an array with a single element, that is an object with {source, value}", function(){
      let result = this.subject.getLayers("foo");
      expect(result.length).to.eql(1);
      expect(result[0]).to.eql({source: "base", value: 1});
    });
  });

  context("when the config has multiple layers", function(){
    beforeEach(function() {
      this.subject.addLayer("base", {foo: 1, bar: 2});
      this.subject.addLayer("mid", {foo: 3});
      this.subject.addLayer("top", {baz: 4});
    });


    it("returns an array with size equal to layer count", function(){
      expect(this.subject.getLayers("foo")).to.have.length(3);
    });

    it("returns values that match the layer results", function(){
      let result = this.subject.getLayers("foo");
      expect(result[0]).to.be.eql({source: "top", value: undefined});
      expect(result[1]).to.be.eql({source: "mid", value: 3});
      expect(result[2]).to.be.eql({source: "base", value: 1});
    });
  });
});

describe("Config#get", function(){
  subject(() => new Config());

  beforeEach(function() {
    this.subject.addLayer("base", {foo: 1, bar: 2, nested: {}});
    this.subject.addLayer("mid", {foo: 3, wrong: false, nulled:null});
    this.subject.addLayer("top", {baz: 4});
  });

  it("returns false values correctly", function(){
    expect(this.subject.get("wrong")).to.be.false();
  });

  it("returns null values correctly", function(){
    expect(this.subject.get("nulled")).to.be.null();
  });

  it("returns the first found value, from most recently added layer down", function(){
    expect(this.subject.get("baz")).to.be.eql(4);
    expect(this.subject.get("foo")).to.be.eql(3);
    expect(this.subject.get("bar")).to.be.eql(2);
    expect(this.subject.get("notfound")).to.be.undefined();
  });

  it("clones the returned value", function() {
    let nested = this.subject.get("nested");
    nested.foo = 3;

    expect(this.subject.get("nested")).to.be.eql({});
  });
});

describe("Config typed helpers", function(){
  subject(() => new Config());

  beforeEach(function() {
    this.subject.addLayer("base", {
      string: "blah", 
      number: 1, 
      boolean: false, 
      array: [1,2,3],
      obj: { val: "hello" },
    });
  });

  it("returns values of correct type", function(){
    expect(this.subject.getString("string")).to.be.eql("blah");
    expect(this.subject.getNumber("number")).to.be.eql(1);
    expect(this.subject.getBoolean("boolean")).to.be.eql(false);
    expect(this.subject.getArray("array")).to.be.eql([1,2,3]);
    expect(this.subject.getObject("obj")).to.be.eql({ val: "hello" });
  });

  it("throw InvalidConfigTypeError when the value isn't a string", function(){
    expect(() => this.subject.getString("number")).to.throw(InvalidConfigTypeError);
    expect(() => this.subject.getNumber("string")).to.throw(InvalidConfigTypeError);
    expect(() => this.subject.getBoolean("string")).to.throw(InvalidConfigTypeError);
    expect(() => this.subject.getArray("string")).to.throw(InvalidConfigTypeError);
    expect(() => this.subject.getObject("string")).to.throw(InvalidConfigTypeError);
  });
});