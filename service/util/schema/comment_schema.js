const mongoose = require('mongoose');
// const Article = require('./article_schema');
// const User = require('./user_schema');
const commentSchema = new mongoose.Schema({
    articleid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    fromId: {
        type: mongoose.Schema.Types.ObjectId
    },
    toId: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    like: {
        type: Number
    },
    content: {
        type: String
    },
    time: {
        type: Date
    },
    commentNum: {
        type: Number
    },
    parentId: {
        // type: String
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});
// { collection: 'comment' }
module.exports = mongoose.model('Comment', commentSchema, 'comment');