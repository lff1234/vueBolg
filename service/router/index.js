const express = require('express');
const router = express.Router();
const services = require('../api/userApi.js');
const Article = require('../util/schema/article_schema');
router.get('/home', function(req, res, next) {
    // console.log(req);
    Article.find({}, function(err, data) {
        if (err) {
            console.log(err);
            return err;
        }
        // console.log(data);
        return res.json(data);
    });
});
router.get('/home/:id', services.contentGet);
router.post('/home/:id', services.comment);
router.get('/logout', function(req, res, next) {
    return res.send('登出成功');
});
// router.get('/home/:id', function(req, res, next) {
//     Article.findOne({ id: parseInt(req.params.id) }, function(err, data) {
//         // console.log(data);
//         return res.json(data);
//     });
// });

// 登录功能
router.post('/login', services.login);
// 注册功能
router.post('/register', services.register);
module.exports = router;