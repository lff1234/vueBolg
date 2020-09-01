var jwt = require('jsonwebtoken');
var signkey = 'token_secret'; // 密匙

exports.setToken = function(user) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
                name: user.username,
                _id: user._id
            },
            signkey, {
                expiresIn: '0.1h'
            }
        );
        resolve(token);
    });
};

exports.verToken = function(token) {
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token.split(' ').pop(), signkey);
        // console.log(info);
        resolve(info);
    });
};