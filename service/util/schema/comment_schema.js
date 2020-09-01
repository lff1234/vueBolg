const mongoose = require('mongoose');
const Article = require('./article_schema');
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
    fromHeadImg: {
        type: String,
        default: 'https://ae01.alicdn.com/kf/Hd60a3f7c06fd47ae85624badd32ce54dv.jpg'
    },
    parentId: {
        // type: String
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    }
});
// { collection: 'comment' }
module.exports = mongoose.model('Comment', commentSchema, 'comment');