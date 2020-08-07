// 创建express服务器
const express = require('express');
const app = express();
//引入mongoose，进行数据库的连接
const mongoose = require('./util/mongoose');
const db = mongoose();
// 注册解析 表单数据的 body-parser
const bodyParser = require('body-parser');
// 将请求响应设置content-type设置为application/json
const router = require('./router.js');
app.use('/api/*', function(req, res, next) {
    // 设置请求头为允许跨域
    console.log(req.headers.origin);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    // 设置服务器支持的所有头信息字段
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
    );
    // 设置服务器支持的所有跨域请求的方法
    res.header('Access-Control-Allow-Methods', 'POST,GET');
    // next()方法表示进入下一个路由
    next();
});
// post
app.use(bodyParser.urlencoded({ extended: false }));
// 处理json格式的参数
app.use(bodyParser.json());
// 配置路由
app.use(router);

// 服务器已经启动
app.listen('8100', function() {
    console.log('running...');
});