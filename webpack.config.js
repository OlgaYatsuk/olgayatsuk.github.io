var webpack = require('webpack');
var path = require('path');
var util = require('gulp-util');
var config = require('./gulp/config');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// uncomment in case of emergency code formatter need
// var PrettierPlugin = require('prettier-webpack-plugin');

const createConfig = (env) => {
    var isProduction, webpackConfig;

    if (env === undefined) {
        env = process.env.NODE_ENV;
    }

    isProduction = env === 'production';

    webpackConfig = {
        context: path.join(__dirname, config.src.scripts),
        entry: {
            vendor: ['jquery'],
            app: './app.js'
        },
        output: {
            path: path.join(__dirname, config.dest.scripts),
            filename: '[name].js',
            publicPath: 'scripts/'
        },
        mode: process.env.NODE_ENV,
        // watch:process.env.NODE_ENV === 'production' ? false : true,
        performance: {
          hints: process.env.NODE_ENV === 'production' ? "warning" : false
        },
        devtool: isProduction ?
            '#source-map' :
            '#cheap-module-eval-source-map',
        optimization: {
          minimize: process.env.NODE_ENV === 'production' ? true : false,
          splitChunks: {
            cacheGroups: {
              vendor: {
                chunks: "initial",
                test: path.resolve(__dirname, "node_modules"),
                name: "vendor",
                enforce: true
              }
            }
          }
        },
        plugins: [

            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                'window.jQuery': "jquery"
            }),
            new webpack.NoEmitOnErrorsPlugin(),

            // new BundleAnalyzerPlugin({
            //     analyzerMode: 'static',
            //     analyzerPort: 4000,
            //     openAnalyzer: false
            // })
        ],
        resolve: {
            extensions: ['.js'],
            alias: {
                "TweenLite": path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
                "TweenMax": path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
                "TimelineLite": path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
                "TimelineMax": path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
                "ScrollMagic": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
                "animation.gsap": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
                "debug.addIndicators": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js')
            }
        },
        module: {
            rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ]
            }]
        }
    };

    if (isProduction) {
        webpackConfig.plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true
            }),
            // new webpack.optimize.UglifyJsPlugin({
            //     compress: {
            //         warnings: false
            //     }
            // })
        );
    }

    return webpackConfig;
}

module.exports = createConfig();
module.exports.createConfig = createConfig;
