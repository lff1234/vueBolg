const User = require('../util/schema/user_schema');
const Comment = require('../util/schema/comment_schema');
const Article = require('../util/schema/article_schema');
const Bcrypt = require('bcryptjs');
const settoken = require('../util/token_vertify');
const fs = require('fs');
const md = require('../util/marked_it');

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
exports.userCard = async(req, res) => {
    let userInfo = await User.findById(req.id);
    console.log(userInfo.toJSON);
    return res.json({
        data: { userInfo }
    });
};
exports.articleImgUpload = async(req, res) => {
    // let img = req.file.filename;
    // let imgpath = req.file.filename;
    // console.log(imgpath);
    let file = req.file;
    let imgName =
        'public/myUpload/resource/' +
        `${Date.now()}.${file.originalname.split('.')[1]}`;
    // console.log(imgName);
    fs.renameSync('public/myUpload/resource/' + file.filename, imgName); //这里修改文件名字
    // console.log(imgName);

    return res.send(imgName);
};

exports.imgUpload = async(req, res) => {
    // console.log(req.file);
    // console.log(req.body);
    let file = req.file;
    let imgName =
        'public/myUpload/' + `${Date.now()}.${file.originalname.split('.')[1]}`;
    // console.log(imgName);
    fs.renameSync('public/myUpload/' + file.filename, imgName); //这里修改文件名字
    let userMsg = await User.findOneAndUpdate({ _id: req.body.userId }, { $set: { avator: imgName } });
    try {
        if (fs.readFileSync(userMsg.avator)) {
            fs.unlinkSync(userMsg.avator);
        }
    } catch (err) {
        console.log(err);
    }

    if (userMsg) {
        return res.json({
            data: {
                success: true,
                msg: '上传成功',
                avator: imgName
            }
        });
    } else {
        return res.send({
            data: {
                success: false,
                msg: '上传失败'
            }
        });
    }
};
exports.contentGet = async(req, res) => {
    // let blogContent = {};
    let comment = [];
    // console.log(typeof req.params.id);
    Article.findOne({ id: parseInt(req.params.id) })
        .lean()
        .populate('comments')
        .then(arr => {
            // console.log(arr);
            // blogContent = arr;
            let arr1 = arr.comments.map(rs => {
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
                                    m['signature'] = val.signature;
                                    if (val.avator != null && val.avator.indexOf('http') == -1) {
                                        m['fromHeadImg'] = '/api/' + val.avator;
                                    } else {
                                        m['fromHeadImg'] = val.avator;
                                    }
                                }
                                if (String(m.toId) === String(val._id)) {
                                    m['toName'] = val.username;
                                }
                            })(val);
                            // console.log(m);
                        });

                        return m;
                    });
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

            // delete blogContent.comments;
            return res.send({
                data: { comment: comment }
            });
        });
};
exports.dianZan = async(req, res) => {
    let { userid, id } = req.body;
    // console.log(userid, id);
    let comment = await Comment.findById({ _id: id });
    if (comment && userid) {
        if (comment.users.indexOf(userid) < 0) {
            let num = comment.like;
            num++;
            // console.log(num);
            let newComment = await Comment.findOneAndUpdate({ _id: id }, { $push: { users: userid }, $set: { like: num } }, {
                new: true
            });
            if (!newComment) {
                console.log('点赞失败');
                return;
            }
            // console.log(newComment);
            return res.json({
                err: 0,
                msg: '点赞成功',
                data: {
                    users: newComment.users,
                    like: newComment.like
                }
            });
        }
    } else {
        return res.json({
            err: '-1',
            msg: '系统错误'
        });
    }
};
exports.cancleZan = async(req, res) => {
    let { userid, id } = req.body;

    let comment = await Comment.findById({ _id: id });
    if (comment) {
        // console.log(comment.users);
        if (comment.users.indexOf(userid) !== -1) {
            let num = comment.like;
            num--;
            let newComment = await Comment.findOneAndUpdate({ _id: id }, { $pull: { users: userid }, $set: { like: num } }, {
                new: true
            });
            if (!newComment) {
                console.log('取消点赞失败');
                return;
            }

            return res.json({
                err: 0,
                msg: '取消点赞成功',
                data: {
                    users: newComment.users,
                    like: newComment.like
                }
            });
        }
    } else {
        return res.json({
            err: '-1',
            msg: '系统错误',
            data: newComment
        });
    }
};
exports.addArticle = async(req, res) => {
    let { editUpdate, userId, title, tags, contentMd, intro } = req.body;
    let obj = await Article.aggregate([
        { $group: { _id: null, id_max: { $max: '$id' } } }
    ]);
    // console.log(obj);
    let id = obj[0].id_max;
    id++;
    // console.log(id);
    let articleObj = await Article.create({
        editUpdate,
        userId,
        title,
        tags,
        intro,
        contentMd,
        id
    });
    let article = articleObj.toJSON();
    if (article) {
        let user = await User.findById({ _id: userId });
        article['username'] = user.username;
        article['contentHtml'] = md.render(`${article.contentMd + '\n${toc}'}`);

        // article['tocHtml'] = md.render(`${'${toc}'}`);
        console.log(article['contentHtml']);
        return res.send({
            err: 0,
            msg: '文章发布成功',
            data: article
        });
    } else {
        return res.send({
            err: -1,
            msg: '文章发布失败'
        });
    }
};
exports.editArticle = async(req, res) => {
    let { editUpdate, id, title, tags, contentMd, intro } = req.body;

    // console.log(id);
    let editedArticle = await Article.findOneAndUpdate({ _id: id }, {
        $set: {
            editUpdate: editUpdate,
            title: title,
            tags: tags,
            contentMd: contentMd,
            intro: intro
        }
    }, {
        new: true
    });
    let article = editedArticle.toJSON();
    if (article) {
        let user = await User.findById({ _id: article.userId });
        article['username'] = user.username;
        article['contentHtml'] = md.render(`${article.contentMd + '\n${toc}'}`);
        // article['contentHtml'] = md.render(`${article.contentMd + '[toc]'}`);
        console.log(typeof contentMd);
        // article['tocHtml'] = md.render(`${'${toc}'}`);
        return res.send({
            err: 0,
            msg: '文章修改成功',
            data: article
        });
    } else {
        return res.send({
            err: -1,
            msg: '文章修改失败'
        });
    }
};
exports.comment = async(req, res) => {
    let comment = await Comment.create({
        articleid: req.body.articleid,
        fromId: req.body.fromId,
        parentId: req.body.parentId,
        toId: req.body.toId,
        like: req.body.like,
        content: req.body.content,
        time: req.body.time,
        commentNum: req.body.commentNum
            // fromHeadImg: req.body.headImg
    });
    // console.log(req.body.articleid);

    // console.log(res);

    let newArticle = await Article.findOneAndUpdate({ _id: req.body.articleid }, { $push: { comments: comment._id } }, {
        new: true
    });
    // console.log(newArticle);
    return res.send({
        data: newArticle,
        msg: '评论成功'
    });
};
exports.refreshToken = async(req, res) => {
    let user = req.body;
    // console.log('yes');
    const token = await settoken.setToken(user, '0.01h');
    const tokenExpireIn = 0.01 * 60 * 60;
    return res.send({
        data: {
            token,
            tokenExpireIn
        }
    });
};
exports.login = async(req, res) => {
    // console.log('提交');
    const user = await User.findOne({ username: req.body.username });
    // let { username, password } = req.body;

    // const isPasswordValid = ;
    // 查询语句
    if (!user) {
        return res.send({
            err: -1,
            msg: '用户名不存在'
        });
    } else if (!Bcrypt.compareSync(req.body.password, user.password)) {
        return res.send({
            err: -2,
            msg: '密码错误'
        });
    } else {
        const token = await settoken.setToken(user);
        const tokenExpireTime = await settoken.verToken(token);
        // console.log(tokenExpireTime.exp);
        return res.send({
            err: 0,
            msg: '登录成功',
            data: {
                userInfo: user,
                tokenObj: {
                    token,
                    tokenExpireTime: tokenExpireTime.exp
                }
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