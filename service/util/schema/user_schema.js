const mongoose = require('mongoose');
const Bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
let userSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String,
        set(val) {
            return Bcrypt.hashSync(val, 10);
        }
    },
    phone: {
        type: Number
    },
    email: {
        type: String
    }
}, { collection: 'user' });
module.exports = mongoose.model('User', userSchema);