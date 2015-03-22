import "../index";
import { Config } from "../lib/config";

describe("core.Config", function() {
  injectNg("core", {config: "core.Config"});

  it("is an instance of Config", function() {
    expect(this.config).to.be.instanceof(Config);
  });
});