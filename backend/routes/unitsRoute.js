const express = require("express")

const { protect } = require('../middlewares/auth')
const ApiError = require('../utils/apiError')
const Unit = require("../models/unitsModel")

const router = express.Router()


async function updateUnits(req, res, next) {
    try {

        const units = await Unit.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true })
        res.send(units)
    } catch(err) {
        return next(new ApiError(err.message, 400))
    }
}

router.put('/', protect, updateUnits)

module.exports = router