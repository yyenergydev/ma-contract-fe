var configs = require('./webpack.base.config'),
    path = require('path'),
    webpack = require('webpack');
var merge = require('webpack-merge')
var plugins=require('./plugins.js')
configs.forEach(function(config){
  config.plugins = config.plugins.concat(plugins.dev(config.language))
  //config.devtool = 'eval-source-map'
  //config.devtool = 'inline-source-map'
  config.devServer = {
    // port: 9090,
    // contentBase: './dist',
    // historyApiFallback: true,
    noInfo: true,
    hot: true,
    inline: true,
    outputPath: path.join(__dirname, 'dist'),
    proxy: {
      '/yuncai': {
        target: 'http://yc.yonyou.com',
        secure: false,
        changeOrigin: true,
        host: "yc.yonyou.com"
      },
      '/file': {
        target: 'http://yc.yonyou.com',
        secure: false,
        changeOrigin: true,
        pathRewrite: {'^/file': '/file1'},
        host: "yc.yonyou.com"
      },
      '/mall-basedoc': {
        target: 'http://yc.yonyou.com',
        secure: false,
        changeOrigin: true,
        host: "yc.yonyou.com"
      },
      '/cpu-project-def': {
        target: 'http://172.20.4.66:9922',
        // target:'http://10.1.80.32:8090',
        secure: false,
        changeOrigin: true,
        host: "172.20.4.66"
      },
      '/cpu-basedocrefer': {
        target: 'http://172.20.4.66:9925',
        secure: false,
        changeOrigin: true,
        host: '172.20.4.66'
      },
      '/cpu-bidtrade': {
        target: 'http://yc.yonyou.com',
        // target: 'http://127.0.0.1:9999',
        secure: false,
        changeOrigin: true,
        host: 'yc.yonyou.com'
      },
      '/ma-contract': {
        target: 'http://10.6.194.119:9999',
        // target: 'http://127.0.0.1:9999',
        secure: false,
        changeOrigin: true,
        host: '10.6.194.119'
        // host: '10.6.253.33'
      }
    }
  }
  config = merge(config, {
    plugins: [
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
      // https://github.com/ampedandwired/html-webpack-plugin
    ]
  })
})


module.exports = configs
