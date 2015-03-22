var path              = require("path");
var _                 = require("lodash");
var webpack           = require("webpack");
let {UglifyJsPlugin}  = webpack.optimize;

module.exports = makeConfig;

var baseConfig = {
  output: {
    filename: "[name].bundle.js"
  },
  resolve: {
    root: [process.cwd()],
    extensions: ["", ".js", ".es6"],
    modulesDirectories: [
      "node_modules/mcs-core/node_modules",
      "node_modules"
    ]
  },
  resolveLoader: {
    root: path.join(__dirname, "..", "node_modules")
  },
  module: {
    loaders: [
      { test: /\.es6$/,  loader: '6to5-loader' },
      { test: /\.scss$/, loader: 'sass?outputStyle=expanded'},
      { test: /\.css$/,  loader: 'raw'}
    ]
  },
  plugins: [
  ]
};

var configForApp = function() {
  return {
    entry: {
      main: "./main.es6",
      head: "./head.es6"
    },
    output: {
      path: './.tmp/webpacked'// path.join(__root, ".tmp", "webpacked")
    }
  };
};

var environments = {
  dev: {
    devtool: "eval-source-map",
    noInfo: true,
  },
  tst: {
    devtool: "inline-source-map"
  },
  stg: {
    devtool: "source-map"
  },
  prd: {
    devtool: "source-map",
    plugins: [
      new UglifyJsPlugin({})
    ]
  }
};

function makeConfig(env, options) {
  var result = {};

  merge(result, baseConfig);

  if(env) {
    merge(result, environments[env]);
  }

  merge(result, configForApp());
  merge(result, options || {});

  return result;
}

// Does a simple deep merge using lodash
function merge(object, source) {
  return _.merge(object, source, function(a, b) {
    return _.isArray(a) ? a.concat(b) : undefined;
  });
}