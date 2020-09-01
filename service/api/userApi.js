const User = require('../util/schema/user_schema');
const Comment = require('../util/schema/comment_schema');
const Article = require('../util/schema/article_schema');
const Bcrypt = require('bcrypt');
const mongoose = require('mongoose');
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
exports.contentGet = async(req, res) => {
    let blogContent = {};
    let comment = [];
    // console.log(typeof req.params.id);
    Article.findOne({ id: parseInt(req.params.id) })
        .lean()
        .then(data => {
            // console.log(data);
            blogContent = data;
            let comment1 = blogContent.comments.map(val => {
                return Comment.findOne({ _id: val })
                    .lean()
                    .then(rs => {
                        return rs;
                    });
            });
            return Promise.all(comment1);
            // return comment1
            // console.log(comment1);
            // return Promise.all(comment1);
        })
        .then(arr => {
            let arr1 = arr.map(rs => {
                return User.find({
                        _id: { $in: [rs.fromId, rs.toId] }
                    })
                    .lean()
                    .then(res => {
                        // console.log(comment);
                        let m = rs;
                        // console.log(m);
                        res.forEach(val => {
                            (function() {
                                if (String(m.fromId) === String(val._id)) {
                                    m['fromName'] = val.username;

                                    // console.log(typeof m.fromId);
                                    // console.log(typeof val._id);
                                }

                                if (String(m.toId) === String(val._id)) {
                                    m['toName'] = val.username;
                                    // console.log(typeof m.fromId);
                                    // console.log(typeof val._id);
                                }
                            })(val);
                            // console.log(m);
                        });

                        return m;
                    });

                // test.then(res => {
                //     // console.log(res);
                // });
            });
            return Promise.all(arr1);
        })
        .then(arr1 => {
            let newObj = {};
            for (let val of arr1) {
                // console.log(val);
                val['reply'] = [];
                newObj[val['_id']] = val;
            }
            // console.log(newObj);
            for (let item of arr1) {
                parentComment = newObj[item['parentId']];
                if (!parentComment) {
                    comment.push(item);
                } else {
                    parentComment.reply.push(item);
                    parentComment.commentNum += 1;
                }
            }
            return res.send({
                data: { comment: comment, blogContent: blogContent }
            });
        });
};
// return res.send({
//     data: { comment: arr, blogContent: blogContent }
// });

exports.comment = async(req, res) => {
    let comment = await Comment.create({
        articleid: req.body.articleid,
        fromId: req.body.fromId,
        parentId: req.body.parentId,
        toId: req.body.toId,
        like: req.body.like,
        content: req.body.content,
        time: req.body.time,
        commentNum: req.body.commentNum,
        fromHeadImg: req.body.headImg
    });
    // console.log(req.body.articleid);

    // console.log(res);

    let newArticle = await Article.findOneAndUpdate({ _id: req.body.articleid }, { $push: { comments: comment._id } }, {
        new: true
    });

    return res.send({
        data: newArticle,
        msg: '评论成功'
    });
    // console.log(newArticle);
};
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
                userInfo: user,

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
        // console.log(newUser);
        // const token = jwtSignUser(newUser);
        res.send({
            err: 0,
            msg: '注册成功'
                // token
        });
    } else {
        res.send({
            err: -1,
            msg: '用户名已存在'
        });
    }
};