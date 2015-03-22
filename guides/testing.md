Testing in the MCS
==================

One significant goal of the modular client system is to ease testing and to improve testing coverage over what the original stellar client had (which won't be hard to do, given it was almost non-existent).

To achieve this, we've attempted to bake testing into the system at the lowest level, making it easy to add unit tests as well as integration i.e. end-to-end testing.

## Buzzwords

- Karma Runner
- Mocha
- Chai

## Running tests

After having successfully cloned the MCS and confirmed that you can build a product from it (see the building guide for details), you should be ready to execute tests against the code base.

`gulp test` will run the test suite once, printing a report after finishing

`gulp test-watch` will continually run the test suite, once at launch and then again after any file is changed that is referred to by the tests


## Unit Testing

Unit testing, as defined by us is "a test that tests a single unit of work".  In more concrete terms, a unit test generally tests a single function or method of a class in some way.

We place unit tests alongside the file in which the object under test is defined.  For example, tests for the ConfigLayer class (defined in `modules/core/lib/config-layer.es6`) are defined at the path `modules/core/lib/config-layer.unit-test.es6`.  As you can see we suffix our unit test files with `.unit-test.es6`, which is how the test runner finds them.

Within a single unit test file, you will notice that there are a number of top-level `describe` blocks that specify the method or function under test.  Within each `describe` block, there may be one or more `context` blocks that provide a specific set of conditions for your test.  Finally, you end with `it` blocks that specify the behavior of the unit under test in the conditions provided by the `context block` from above.

## Unit Testing Angular Components

Unit testing angular components is mostly the same as above, but now you have to content with the angular dependency injection system.  To handle this, we introduce the `injectNg` helper mechanism.

### the `injectNg` helper

An example:

```
describe("core.Config", function() {
  injectNg("core", {config: "core.Config"});

  it("is an instance of Config", function() {
    expect(this.config).to.be.instanceof(Config);
  });
});
```

Notice the `injectNg` statement.  This statement is saying "I want to make the 'core' module available to my tests, and I want to inject the 'core.Config' dependency into a variable named 'config'".  Below, in the `it` block, we refer to that inject value with the expression `this.config`.



## End to end (E2E) testing

TODO

## Testing Strategy

tl;dr;

- Include unit tests with your PRs
- Don't just test the happy path, identify and test edge cases
- Any specifically identified absences in coverage should be reported in  pull requests, so that we can work together to solve the gap
- Test the API, not the implementation
- Only mock for true external dependencies

TODO: fill the strategy section out