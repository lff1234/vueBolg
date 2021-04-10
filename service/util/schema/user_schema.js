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
    },
    avator: {
        type: String,
        default: 'https://ae01.alicdn.com/kf/Hd60a3f7c06fd47ae85624badd32ce54dv.jpg'
    },
    signature: {
        type: String,
        default: '此人还未写自己的人生格言哦'
    }
}, { collection: 'user' });
module.exports = mongoose.model('User', userSchema);