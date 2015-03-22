/**
 *
 * All the tasks involved with building our project go here, including:
 *
 * Webpacking, applying content-hashes to files, copying content into build
 * directories
 *
 */


import webpackConfig from "./webpack.config";
import webpack from "webpack";
import runSequence from "run-sequence";
import fs from "fs";
import crypto from "crypto";
import reworkImport from "rework-import";
import path from 'path';
import del from 'del';

let compiler;

gulp.task("build", ['build:make-compiler'], done => {
  runSequence(
    ['build:webpack', 'build:css'],
    'build:content-hash',
    'build:write-build-time',
    'build:copy-to-dist',
    done);
});

gulp.task("build-watch", ['build'], () => {
  gulp.watch('apps/**/*',    ['build']);
  gulp.watch('modules/**/*', ['build']);
  gulp.watch('lib/**/*',     ['build']);
});

gulp.task("build:webpack", done => {
  compiler.purgeInputFileSystem();
  compiler.run(done);
});

gulp.task("build:css", () => {
  let loadPaths = [
    `./`,
    `./bower_components`,
    `./node_modules`
  ];

  return gulp.src('./main.scss')
    .pipe($.rubySass({
      //bundleExec: true,
      loadPath: loadPaths
    }))
    // .pipe($.filter(["!**/*.map"]))
    .pipe($.filter(f => path.extname(f.path) !== '.map'))
    .pipe($.rework(
      reworkImport({path: loadPaths}),
      {sourcemap: true}
    ))
    .pipe(gulp.dest('.tmp/css'));
  // run maincss file through ruby-sass, with found include directories
});

gulp.task("build:content-hash", () => {
  let hashes = [
    `.tmp/webpacked/main.bundle.js`,
    `.tmp/webpacked/head.bundle.js`,
    `.tmp/css/main.css`
  ].map(sha1ForFile);

  let contentHash = sha1(hashes.join(":")).slice(0, 8);

  //only filter out the root index.html
  let notIndexFilter = $.filter(file => file.relative !== "index.html");


  return gulp.src([
    `.tmp/webpacked/**/*`,
    `.tmp/css/**/*`
  ])
    // inject base reference
    .pipe($.replace(/<!--\s*mcs:content-base\s*-->/g, `<base href="${contentHash}/">`))
    // move underneath base hash
    .pipe(notIndexFilter)
    .pipe($.rename(path => {
      path.dirname += '/' + contentHash;
    }))
    .pipe(notIndexFilter.restore())
    .pipe(gulp.dest('.tmp/hashed'));
});

gulp.task("build:copy-to-dist", () => {
  let basePath = '.tmp/hashed';
  return gulp.src(basePath + "/**/*")
    .pipe($.gzip())
    .pipe(gulp.dest('./dist/'));
});

gulp.task("build:write-build-time", done => {
  fs.writeFile('.tmp/hashed/BUILT_AT', (new Date()).toString(), done);
});

gulp.task("build:make-compiler", () => {
  if(compiler){ return; }
  let options = webpackConfig(cli.env, {});

  if(cli.verbose) {
    $.util.log("Starting webpack compiler with options:");
    $.util.log(JSON.stringify(options, null, "  "));
  }

  compiler = webpack(options);

  compiler.plugin('done', stats => {
    console.log(stats.toString({
      hash: false,
      version: false,
      timings: false,
      chunks: false,
      colors: true
    }));
  });
});

gulp.task('build-atom', done => {
  runSequence(
    "build-atom:build-zip",
    "build-atom:move-zip",
    "build-atom:unzip",
    "build-atom:delete-zip",
    done);
});

gulp.task('build-atom:build-zip', ['build'], () => {
  return gulp.src([
    `.tmp/hashed/**/*`,
    // TODO
    //`support/atom/**/*`,
  ])
    .pipe($.atomShell({
      version: '0.20.4',
      productName: cli.app,
      productVersion: '0.0.1',
      platform: 'darwin'
    }))
    .pipe($.atomShell.zfsdest(`./app.zip`))
    ;
});

gulp.task('build-atom:move-zip', () => {
  return gulp.src(`./app.zip`)
    .pipe(gulp.dest(`./dist/atom/`))
    ;
});

gulp.task('build-atom:unzip', () => {
  return gulp.src(`./dist/atom/app.zip`)
    .pipe($.shell('unzip -oqq <%= file.path %> -d ./dist/atom/app'))
    ;
});

gulp.task('build-atom:delete-zip', done => {
  del([`./${cli.app}.zip`], done);
});

function sha1ForFile(path) {
  let content = fs.readFileSync(path);
  return sha1(content);
}

function sha1(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}