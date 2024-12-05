const jwt = require('jsonwebtoken')
const User = require('../models/usersModel')
const ApiError = require('../utils/apiError')

async function protect(req, res, next) {

    if (!req.headers.authorization) {
        return next(new ApiError("Unauthorized", 401))
    }

    if (!req.headers.authorization.startsWith("Bearer")) {
        return next(new ApiError("Invalid Token Type", 401))
    }

    try {

        let token = req.headers.authorization.split(" ")[1]
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decoded.id)
        if (!user) throw new Error("Invalid Token !")
        req.user = user;
        next()

    } catch(err) {
        return next(new ApiError(err.message || "Invalid Token !!", 401))
    }
}

module.exports = { protect }