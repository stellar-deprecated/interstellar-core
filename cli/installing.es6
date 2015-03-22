import Promise from 'bluebird';
import _       from 'lodash';
import npm     from 'npm';
import bower   from 'bower';
import path    from 'path';
import fs      from 'fs';
import endpointParser from 'bower-endpoint-parser';
import runSequence from "run-sequence";

gulp.task("install", done => {
  runSequence(
    'install:npm',
    'install:bower',
    done);
});

gulp.task("install:npm", done => {
  if (!cli.app) {
    console.log('--app parameter missing.'.red);
    return;
  }

  let packageJson = require(`../apps/${cli.app}/package.json`);
  let npmPackages = _(packageJson.dependencies).reduce((packages, value, key) => {
    packages.push(`${key}@${value}`);
    return packages;
  }, []);

  if (!npmPackages) {
    done();
    return;
  }
  npm.load({
    loaded: false
  }, err => {
    if (err) {
      console.log('Error starting NPM.'.red);
      console.log(err);
      return;
    }

    npm.commands.install(`apps/${cli.app}`, npmPackages, (err, data) => {
      if (err) {
        console.log('Error installing NPM packages.'.red);
        console.log(err);
        return;
      }
      console.log('NPM packages installed.'.green);
      done();
    });

    npm.on("log", message => console.log(message));
  });
});

gulp.task("install:bower", done => {
  if (!cli.app) {
    console.log('--app parameter missing.'.red);
    return;
  }

  traverseNodeModules(cli.app)
    .then(packages => {
      if (!packages) {
        return;
      }
      bower.commands
        .install(packages, {save: true}, {directory: `apps/${cli.app}/bower_components`})
        .on('error', err => {
          console.log('Error installing Bower packages.'.red);
          console.log(err);
        })
        .on('end', installed => {
          console.log('Bower packages installed.'.green);
          done();
        });
    });
});

/**
 * Returns all bower packages with versions found in top level modules in node_modules.
 * @param app
 * @returns {Promise}
 */
function traverseNodeModules(app) {
  return new Promise((resolve, reject) => {
    let modulesDir = `apps/${app}/node_modules`;
    fs.readdir(modulesDir, function (err, files) {
      if (err) {
        return reject(err);
      }

      let packages = [];
      for (let index in files) {
        let stat = fs.statSync(path.join(modulesDir, files[index]));
        let bowerPath = path.resolve(modulesDir, files[index], 'bower.json');
        if (stat.isDirectory() && fs.existsSync(bowerPath)) {
          let bower = require(bowerPath);
          let decomposed = endpointParser.json2decomposed(bower.name, bower.version);
          packages.push(endpointParser.compose(decomposed));
        }
      }
      resolve(packages);
    });
  })
}