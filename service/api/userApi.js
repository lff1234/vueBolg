const User = require('../util/schema/user_schema');
const Articel = require('');
exports.login = (req, res) => {
    let { username, password } = req.body;
    // 查询语句
    if (username && password) {
        User.find({ username, password })
            .then((data) => {
                if (data.length > 0) {
                    res.send({ err: 0, msg: '登陆成功' });
                } else {
                    res.send({ err: -2, msg: '用户名或密码错误' });
                }
            })
            .catch((err) => {
                return res.send({ err: -1, msg: '内部错误' });
            });
    }
};
exports.register = (req, res) => {
    let { username, password } = req.body;
    // 查询语句
    if (username && password) {
        User.find({ username })
            .then((data) => {
                if (data.length === 0) {
                    return User.insertMany({
                        username: username,
                        pwd: password,
                    });
                } else {
                    res.send({ err: -3, msg: '用户名已存在' });
                }
            })
            .then(() => {
                res.send({ err: 0, msg: '注册成功' });
            })
            .catch((err) => {
                res.send({ err: -2, msg: '注册失败' });
            });
    } else {
        return res.send({ err: -1, msg: '参数错误' });
    }
};