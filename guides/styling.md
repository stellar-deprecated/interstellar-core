Styling the MCS (i.e. the CSS pipeline)
==========================================

Understanding how to define and structure your styles in the MCS is important.  By following the structure, you'll be helping to build a set of scalable styles that hopefully will not devolve into a cryptic mess. 

## Buzzwords

- gulp-ruby-sass
- rework
- rework-import
- BEM

## Build Process overview

The goal of the css build process is to produce a single bundled css file that is suitable for serving to client browsers.  To accomplish this, the process has two phases: pre-processing sass files into css, then post-processing that css file using rework.  Conceptually, there are several steps that happen when building the final css:

1.  Import sass dependencies
2.  resolve sass mixins
3.  inline css imports

Presently, gulp-ruby-sass is used to handle the first 2 steps, and rework/rework-import is used to handle the 3rd.  Overtime, additional steps will be introduced for things like z-index management, auto-prefixing, minification and the like.


## The Entrypoint (main.scss)

Each application within the MCS defines a single root sass file, named main.scss.  This file should ideally be comprised mostly of import statements, relying upon modules to provide the actual style rules.

## Importing styles

Importing styles into your main scss file is simple:  use the `@import` directive, as seen in the following examples:

```css

// import a bower-based sass file
@import "susy/sass/susy" 

// import a bower-based css file
@import "normalize.css/normalize.css"

// import an mcs module's style
@import "trading/styles"

```

### External dependencies

External css dependencies can be tricky.  There are many possible ways you can bring external css into your project:  bower, npm, copy-pasta, etc.  In addition, there are many ways you can then package those external dependecies into your built project:  gulp-bower-files, inlining, manual gulp tasks, etc.

Here's our philosophy:  We inline external dependencies into the single main.css file that gets built, and we manage external css assets using bower, then npm, then manual vendoring, in that order.

Both our css pre-processor (sass) and our post-processor (rework) have been setup to include the appropriate directories (`bower_components`, `node_modules`) in their search paths, meaning you should be able to simply `@import` the files you need.

### modules styles

Each module within the mcs may or may not have styles.  For those that do, they will define a `styles.scss` file at their module root that you may import into the `main.scss` file of an app to include those styles into your application.

### Sass imports vs. CSS imports

It's worth noting one wrinkle in the build pipeline:  Sass does not inline/import `@import` statements that refer to css files, but _does_ inline sass files that it can find.  To accomplish the former, we use rework-import to inline any remaining @import statements that end up in the css resulting from the sass compilation.

## Defining styles within modules

TODO

### Overriding sass variables

TODO

## BEM (Block, Element Modifier)

TODO

### Syntax

TODO
block
block__element
block--modifier
dashed-block
dahsed-block__element--element-modifier



