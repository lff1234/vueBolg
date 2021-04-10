module.exports = {
    presets: [
            // '@vue/cli-plugin-babel/preset',
            [
                '@vue/app',
                {
                    polyfills: ['es6.promise', 'es6.symbol']
                }
            ]
            // ['@babel/preset-env', { modules: false }]
            // [
            //     '@babel/preset-env',
            //     {
            //         useBuiltIns: 'entry'
            //     }
            // ]
        ]
        // plugins: [
        //     [
        //         'component',
        //         {
        //             libraryName: 'element-ui',
        //             styleLibraryName: 'theme-chalk'
        //         }
        //     ],
        //     ['syntax-dynamic-import']
        // ]
};