const mongoose = require('mongoose');
const Comment = require('./comment_schema');
const articleSchema = new mongoose.Schema({
    uesrid: Number,
    id: Number,
    title: String,
    body: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});
module.exports = mongoose.model('Article', articleSchema, 'article');