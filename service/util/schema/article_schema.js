const mongoose = require('mongoose');
const articleSchema = new mongoose.Schema({ uesrid: Number, id: Number, title: String, body: String }, { collection: 'article' });
module.exports = mongoose.model('Article', articleSchema);