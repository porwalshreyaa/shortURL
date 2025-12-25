const jwt = require('jsonwebtoken');
require('dotenv').config()

secretKey = process.env.SECRET;

function setUser(user){
    return jwt.sign({
        _id: user._id,
        email: user.email,
    }, secretKey)
}

function getUser(token) {
    if (!token) return null;
    return jwt.verify(token, secretKey);
}

module.exports = {
    setUser,
    getUser,
};