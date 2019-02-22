
'use strict';
//Initialization
const webpack = require('webpack');

//File ops
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Folder ops
const path = require('path');

// Constants
const SRC = path.join(__dirname, 'src/js/foldertree');
const BUILD = path.join(__dirname, 'build');
const TEMPLATE = path.join(__dirname, 'src/index.html');
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;



module.exports = {
 // webpack-dev-server configuration
    devServer: {
        contentBase:'build/etl-monitor',
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only',
        host: HOST,
        port: PORT,
        outputPath: BUILD, // The path should be an absolute path to your build destination.
        proxy: {
            '/etl-monitor/*': {
                //target: 'http://172.27.8.216:8080',
		target: 'http://172.27.9.12:8080',
		//target: 'http://172.27.8.185:8080',
                secure: false,
                auth: 'admin:password'
            }
        }
    },
    entry: {
        index : SRC,
        common :['angular', 'jquery']
    },
    output: {
        path: BUILD,
        publicPath: '/etl-monitor/static',
        filename: 'js/[name].js'
    },
    resolve: { 
        extensions: ['', '.js', '.css'] 
    },
    module: {
        loaders: [
            {test: /\.(es6|js)$/, exclude: /(lib|node_modules)/, loader: 'babel-loader',query: {presets: ['es2015']}},
            {test:/\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
            // inline base64 URLs for <=8k images, direct URLs for the rest
            {test: /\.(png|gif|jpg|ttf|woff|svg|eot)$/, loader: 'url-loader'},
            {test: /\.html$/, loader: 'raw'},
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common','js/common.js'),
        new HtmlwebpackPlugin({
            title: '',
            template:TEMPLATE,
            filename: 'index.html',
            inject:true,
            hash:false
        }),
        new webpack.BannerPlugin('This file is created by Fine'),
        new ExtractTextPlugin("css/styles.css")
       ]
};
