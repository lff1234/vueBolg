const User = require('../util/schema/user_schema');
const Bcrypt = require('bcrypt');
const settoken = require('../util/token_vertify');
/*
生成 token
jwt.sign() 接受两个参数，一个是传入的对象，一个是自定义的密钥
*/
// function jwtSignUser(user) {
//     const ONE_WEEK = 60 * 60 * 24 * 7;

//     return jwt.sign(user.toJSON(), SECRET, {
//         expiresIn: ONE_WEEK
//     });
// }
exports.login = async(req, res) => {
    const user = await User.findOne({ username: req.body.username });
    // let { username, password } = req.body;
    // console.log(username + ':' + password);
    const isPasswordValid = Bcrypt.compareSync(req.body.password, user.password);
    // 查询语句
    if (!user) {
        return res.send({
            err: -1,
            msg: '用户名不存在'
        });
    } else if (!isPasswordValid) {
        return res.send({
            err: -2,
            msg: '密码错误'
        });
    } else {
        const token = await settoken.setToken(user);
        return res.send({
            err: 0,
            msg: '登录成功',
            data: {
                userInfo: user.username,
                token
            }
        });
    }
};
exports.register = async(req, res) => {
    let { username, password, phone, email } = req.body;
    const user = await User.findOne({ username: req.body.username });
    // 查询语句
    if (!user) {
        const newUser = await User.create({
            username: username,
            password: password,
            phone: phone,
            email: email
        });
        console.log(newUser);
        const token = jwtSignUser(newUser);
        res.send({
            err: 0,
            msg: '注册成功',
            token
        });
    } else {
        res.send({
            err: -2,
            msg: '用户名已存在'
        });
    }
};