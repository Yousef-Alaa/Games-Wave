const ApiError = require('../utils/apiError')

exports.notFound = function(req, res, next) {
    next(new ApiError("Unkown Route", 404))
}


exports.errorHandler = function(err, req, res, next) {

    let response = {
        success: false,
        statusCode: err.statusCode || 500,
        status: `${err.statusCode}`.startsWith(4) ? 'fail' : 'error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    }

    res.status(response.statusCode).send(response)
    
}