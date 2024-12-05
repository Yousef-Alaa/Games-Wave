const jwt = require('jsonwebtoken')

exports.generateToken = function(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { 
        expiresIn: process.env.NODE_ENV === 'development' ? '1h' : '7d'
    })
}