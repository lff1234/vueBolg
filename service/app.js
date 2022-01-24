// 创建express服务器
const express = require('express');

const path = require('path');
const app = express();
const mongoose = require('./util/mongoose');
const db = mongoose();
// const vertoken = require('./util/token_vertify');
const expressJwt = require('express-jwt');
const router = require('./router/index.js');

// 注册解析 表单数据的 body-parser
const bodyParser = require('body-parser');
// post
app.use(bodyParser.urlencoded({ extended: false }));
// 处理json格式的参数
app.use(bodyParser.json());

// // const services = require('./api/userApi.js');
// // 将请求响应设置content-type设置为application/json

//解析token获取用户信息
// app.use(function(req, res, next) {
//     let token = req.headers['authorization'];
//     // console.log(token);
//     if (token == undefined) {
//         return next();
//     } else {
//         vertoken
//             .verToken(token)
//             .then(data => {
//                 // req.data = data;
//                 console.log(data);
//                 return next();
//             })
//             .catch(error => {
//                 return next();
//             });
//     }
// });

//验证token是否过期并规定哪些路由不用验证
app.use(
    expressJwt({
        secret: 'token_secret', // 密匙
        algorithms: ['HS256']
    }).unless({
        path: [
                { url: /^\/api\/home\/\d{1,}/, methods: ['GET'] },
                { url: '/api/dianzan', methods: ['GET'] },
                {
                    url: /^\/api\/public\/myUpload(\/.+){0,}?/,
                    methods: ['GET']
                },
                { url: /^\/api\/home(\/tag)?/, methods: ['POST'] },
                '/api/logout',
                '/api/login',
                '/api/register',
                '/api/tag',
                '/api/refreshToken'
            ] //除了这个地址，其他的URL都需要验证
    })
);

// // app.use(express.static(path.join(__dirname, 'api')));

//当token失效返回提示信息
app.use(function(err, req, res, next) {
    if (err.status == 401) {
        // console.log('token失效');
        return res.status(401).send('token失效');
    }
});
app.use('/api/*', function(req, res, next) {
    // 设置请求头为允许跨域
    // console.log(req.headers);
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // 设置服务器支持的所有头信息字段
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
    );
    // 允许携带cookie
    //  res.setHeader('Access-Control-Allow-Credentials', true)
    // 设置服务器支持的所有跨域请求的方法
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET');
    // 预检的存活时间
    res.setHeader('Access-Control-Max-Age', 6);
    if (req.method === 'OPTIONS') {
        res.end(); // OPTIONS请求不做任何处理
    }
    // next()方法表示进入下一个路由
    next();
});

// 配置路由
app.use('/api', router);
app.get('/', (req, res) => {
    res.send('123');
});

app.use('/api/public', express.static(path.join(__dirname, 'public')));
// app.post('/login', services.login);
// 服务器已经启动
app.listen('8700', function() {
    console.log('running...');
});