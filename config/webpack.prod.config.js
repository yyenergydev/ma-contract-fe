var configs = require('./webpack.base.config')
var plugins=require('./plugins.js')
configs.forEach(function(config){
  config.plugins = config.plugins.concat(plugins.prod(config.language));
  config.devtool = "source-map";
  config.output.publicPath = "../";
})

module.exports = configs
