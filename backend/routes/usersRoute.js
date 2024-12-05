const express = require("express")
const fileUpload = require('express-fileupload')
const imageUpload = require('../middlewares/imageUpload')
const { protect } = require('../middlewares/auth')
const { 
    register,
    login,
    getMe,
    updateUser,
    deleteUser,
    verifyEmail,
    sendVerificationEmail,
    resetPassword,
    forgotPassword
} = require("../controllers/usersController")

const router = express.Router()


router.get("/getme", protect, getMe)

router.post("/register", fileUpload(), imageUpload(['.png', '.svg', '.jpg']), register)
router.post("/login", login)

router.post('/verify-email', protect, verifyEmail)
router.post('/send-verify-email', protect, sendVerificationEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

router.route("/")
            .put(protect, fileUpload(), imageUpload(['.png', '.svg', '.jpg']), updateUser)
            .delete(protect, deleteUser)


module.exports = router;