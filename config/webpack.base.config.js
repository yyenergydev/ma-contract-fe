var plugins = require("./plugins"),
    basepath = process.cwd(),
    path = require('path'),
    distpath = path.resolve(basepath,  "./dist"),
    I18nPlugin = require("i18n-webpack-plugin"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    CopyWebpackPlugin = require('copy-webpack-plugin');
var projectRoot = path.resolve(__dirname, '../')
//当前支持的所有语种及对应多语资源包
var languages = {
    "zh_CN": require("../locale/zh_CN/translation.json")
};
var configs = Object.keys(languages).map(function(language) {
    return {
        cache: true,
        entry: plugins.entry,
        language: language,
        output: {
            path: distpath,
            publicPath: "/",
            //filename: "[name]/index." + language + ".js"
            filename: "[name]/index.js"
        },
        module: {
            preLoaders: [
                {
                    test: /\.js$/,
                    loader: 'eslint',
                    include: projectRoot,
                    exclude: /node_modules/
                }
            ],
            loaders: [
              {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', "stage-0"]
                }
              }, {
                test: /\.css$|\.less$/,
                loader: ExtractTextPlugin.extract("style","css!less")
              }, {
                test: /\.html/,
                loader: "html?interpolate"
              }
            ]
        },
        resolve: {
            alias: {
              'src': path.resolve(__dirname, '../src'),
              'assets': path.resolve(__dirname, '../src/assets'),
              'components': path.resolve(__dirname, '../src/components'),
              'static': path.resolve(__dirname, '../static'),
              'common': path.resolve(__dirname, '../src/common'),
              'model': path.resolve(__dirname, '../src/data/model'),
              'collection': path.resolve(__dirname, '../src/data/collection')
            }
        },
        plugins: [
            new CopyWebpackPlugin([{
                from: path.resolve(__dirname, '../static')+'/**/*',
                to: path.resolve(__dirname, '../dist')
            },{
              from: path.resolve(__dirname, '../readme.md'),
              to: path.resolve(__dirname, '../dist/static')
            }]),
            new I18nPlugin(languages[language]),
            new ExtractTextPlugin("[name].css")
        ],
        htmlLoader: {
	        //ko虚拟dom不能注释
	        ignoreCustomComments: [ /^!/, /^( [\/]?ko )(\S|\s)*(\s?)$/]
	    }
    }
})
module.exports = configs
