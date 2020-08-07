const express = require('express');
const router = express.Router();
const services = require('./api/userApi.js');
router.get('/article', services.post);

// 登录功能
router.post('/login', services.login);
// 注册功能
router.post('/register', services.register);
module.exports = router;