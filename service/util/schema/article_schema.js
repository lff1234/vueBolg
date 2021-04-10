const mongoose = require('mongoose');
const Comment = require('./comment_schema');
const User = require('./user_schema');
const articleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    id: Number,
    title: String,
    body: String,
    tags: Array,
    intro: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    editUpdate: {
        type: Date
    },
    contentMd: String
});
module.exports = mongoose.model('Article', articleSchema, 'article');