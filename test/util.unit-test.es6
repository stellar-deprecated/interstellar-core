import { deepGet } from "../lib/util";

describe("#deepGet", function(){
  let data = {
    foo: {
      bar: {
        baz: 3
      }
    }
  };

  context("when using a keyPath that targets a leaf", function(){
    it("returns the value", function(){
      expect(deepGet(data, "foo/bar/baz")).to.eql(3);
    });
  });

  context("when using a keyPath that targets an inner element", function(){
    it("returns the subtree", function(){
      expect(deepGet(data, "foo/bar")).to.eql({baz: 3});
      expect(deepGet(data, "foo")).to.eql({bar: {baz: 3}});
    });
  });

  context("when using a keyPath with a missing element", function(){
    it("returns undefined", function(){
      expect(deepGet(data, "foo/bar/bun")).to.be.undefined();
      expect(deepGet(data, "foo/blah/baz")).to.be.undefined();
      expect(deepGet(data, "missing")).to.be.undefined();
    });
  });

  context("when using a keyPath that extends beyond a leaf", function(){
    it("returns undefined", function(){
      expect(deepGet(data, "foo/bar/baz/poo")).to.be.undefined();
    });
  });
});