module.exports = {
    chainWebpack(config) {
        config.entry('main').add('babel-polyfill');
    }
    // devServer: {
    //     // port: 5000,
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:8700',
    //             changeOrigin: true,
    //             ws: true,
    //             pathRewrite: {
    //                 '^/api': ''
    //             }
    //         }
    //     }
    // }
};