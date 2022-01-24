// 开启 Scope Hoisting
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path');
// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
// 本地环境是否需要使用cdn
const devNeedCdn = false;

// cdn链接
const cdn = {
    // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
    externals: {
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
        'element-ui': 'ElEMENT',
        axios: 'axios'
    },
    // cdn的css链接
    css: ['https://unpkg.com/element-ui/lib/theme-chalk/index.css'],
    // cdn的js链接
    js: [
        'https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.min.js',
        'https://cdn.bootcdn.net/ajax/libs/vuex/3.1.3/vuex.min.js',
        'https://cdn.staticfile.org/vue-router/3.1.6/vue-router.min.js',
        'https://unpkg.com/axios/dist/axios.min.js',
        'https://unpkg.com/element-ui@2.14.1/lib/index.js',
        'https://cdn.jsdelivr.net/npm/proxy-polyfill@0.3.0/proxy.min.js'
    ]
};
module.exports = {
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            cdn: cdn
        }
    },
    lintOnSave: true,
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    configureWebpack: {
        resolve: {
            // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
            mainFields: ['jsnext:main', 'browser', 'main']
        },
        // module: {
        //     rules: [{ test: /\.ejs$/, use: ['ejs-loader'] }]
        // },
        plugins: [
            // 开启 Scope Hoisting
            new ModuleConcatenationPlugin(),
            new HtmlWebpackPlugin({}),
            new BundleAnalyzerPlugin()
        ]
    },
    configureWebpack: config => {
        // 用cdn方式引入，则构建时要忽略相关资源

        if (isProduction || devNeedCdn) config.externals = cdn.externals;
        // 生产环境相关配置
        if (isProduction) {
            // 代码压缩
            config.plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        //生产环境自动删除console
                        compress: {
                            // warnings: false, // 若打包错误，则注释这行
                            drop_debugger: true,
                            drop_console: true,
                            pure_funcs: ['console.log']
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            );
            config.performance = { hints: false };
            // gzip压缩
            const productionGzipExtensions = ['html', 'js', 'css'];
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path][base].gz',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240, // 只有大小大于该值的资源会被处理 10240
                    minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                    deleteOriginalAssets: false // 删除原文件
                })
            );
            //公共代码抽离;
            //     config.optimization = {
            //         splitChunks: {
            //             cacheGroups: {
            //                 vendor: {
            //                     chunks: 'all',
            //                     test: /node_modules/,
            //                     name: 'vendor',
            //                     minChunks: 1,
            //                     maxInitialRequests: 5,
            //                     minSize: 0,
            //                     priority: 100
            //                 },
            //                 common: {
            //                     chunks: 'all',
            //                     test: /[\\/]src[\\/]js[\\/]/,
            //                     name: 'common',
            //                     minChunks: 2,
            //                     maxInitialRequests: 5,
            //                     minSize: 0,
            //                     priority: 60
            //                 },
            //                 styles: {
            //                     name: 'styles',
            //                     test: /\.(sa|sc|c)ss$/,
            //                     chunks: 'all',
            //                     enforce: true
            //                 },
            //                 runtimeChunk: {
            //                     name: 'manifest'
            //                 }
            //             }
            //         }
            // };
        }
    },
    chainWebpack: config => {
        // // 打包分析
        // if (isProduction) {
        //     config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [{
        //         analyzerMode: 'static'
        //     }]);
        // }
        // config.plugins.delete('preload');
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 10240 }));
        // ============压缩图片 start============
        config.module
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({ bypassOnDebug: true })
            .end();
        // ============压缩图片 end============

        // ============注入cdn start============
        // 生产环境或本地需要cdn时，才注入cdn
        if (isProduction || devNeedCdn) {
            config.plugin('html').tap(args => {
                // args[0].template = './index.ejs';
                args[0].cdn = cdn;
                return args;
            });
        }
    },
    chainWebpack(config) {
        config.entry('main').add('babel-polyfill');
    }
    // devServer: {
    //     host: 'localhost',
    //     // port: 3000,
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:8700',
    //             changeOrigin: true,
    //             ws: true,
    //             pathRewrite: {
    //                 '^/api': '/api'
    //             }
    //         }
    //     }
    // }
    // transpileDependencies: [/node_modules[/\\\\](element-ui|vuex|)[/\\\\]/]
};