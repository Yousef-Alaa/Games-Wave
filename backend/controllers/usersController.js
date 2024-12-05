const crypto = require('crypto')
const bcrypt = require('bcryptjs');

const Users = require('../models/usersModel')
const Market = require('../models/marketModel')
const Unit = require('../models/unitsModel')

const sendMail = require('../utils/sendMail')
const ApiError = require('../utils/apiError')
const defaultUnits = require("../utils/defaultUnits")
const { generateToken } = require("../utils/token")
const { verifyEmailTemplate, resetPasswordTemplate } = require('../utils/mailTemplates')

// @desc    Get User By Token
// @route   GET /api/users/getme
// @access  Private
async function getMe(req, res, next) {
    try {

        const {name, username, email, emailVerified, profilePhoto } = req.user
        const units = await Unit.findOne({ userId: req.user.id })

        res.status(200).send({
            success: true,
            message: "Success",
            user: {
                id: req.user.id,
                name,
                username,
                email,
                emailVerified,
                profilePhoto,
                units
            }
        })
    } catch(err) {
        next(new ApiError(err.message, 400))
    }
}

// @desc    Register New User
// @route   POST /api/users/register
// @access  Public
async function register(req, res, next) {
    try {
        const { name, username, email, password, profilePhoto } = req.body
        
        if (!name || !username || !email || !password) {
            let error = [];
            if (!name) error.push('Name')
            if (!username) error.push('Username')
            if (!email) error.push('Email')
            if (!password) error.push('Password')
            throw new Error(`${error.join(', ')} Are Required Fields`)
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailPattern.test(email)) {
            throw new Error("Invalid Email")
        }
        

        const salt = await bcrypt.genSalt(14)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create a CODE
        const verifyCode = `${Math.floor(Math.random() * 900000) + 100000}`;
        const verifyCodeExpire = new Date(Date.now() + 60 * 60 * 1000); // Add 1 Hour

        const user = await Users.create({
            name,
            username,
            email,
            profilePhoto,
            verifyCode,
            verifyCodeExpire,
            password: hashedPassword
        })

        await Unit.create({
            userId: user.id,
            ...defaultUnits
        })

        await sendMail({ 
            to: email, 
            subject: "Email Verification", 
            html: verifyEmailTemplate
                    .replace('{verify_code}', verifyCode)
                    .replace('{first_name}', name.split(' ')[0]) 
        })

        res.status(201).send({
            success: true,
            message: "User Created Successfuly",
            token: generateToken(user.id),
            user: {
                id: user.id,
                name,
                username,
                email,
                emailVerified: user.emailVerified,
                profilePhoto,
                units: defaultUnits
            }
        })
    } catch(err) {
        let message;
        if (err.code === 11000) {
            let key = Object.keys( err.keyValue )[0]
            message = `${key} is used. Please try another one`
        }
        next(new ApiError(message || err.message, 400))
    }
}

// @desc    Login
// @route   POST /api/users/login
// @access  Public
async function login(req, res, next) {
    try {

        if (!req.body.username || !req.body.password) {
            throw new Error("Username and Password is Required")
        }

        const user = await Users.findOne({ username: req.body.username})

        if (!user) {
            throw new Error("Can't find user with username " + req.body.username)
        }

        if (! await bcrypt.compare(req.body.password, user.password)) {
            throw new Error("Wrong Password")
        }

        const {name, username, email, emailVerified, profilePhoto } = user
        const units = await Unit.findOne({ userId: user.id })

        res.status(200).send({
            success: true,
            message: "Loged In Successfuly",
            token: generateToken(user.id),
            user: {
                id: user.id,
                name,
                username,
                email,
                emailVerified,
                profilePhoto,
                units
            }
        })

    } catch(err) {
        next(new ApiError(err.message, 400))
    }
}

// @desc    Verify Email
// @route   POST /api/users/verify-email
// @access  Private
async function verifyEmail(req, res, next) {
    
    const { verifyCode } = req.body

    try {
        if (req.user.verifyCodeExpire < (new Date())) {
            throw new Error("Expired Code")
        } else if (req.user.verifyCode === verifyCode) {
            req.user.emailVerified = true
            req.user.verifyCode = undefined
            req.user.verifyCodeExpire = undefined
            await req.user.save()
            res.send({
                success: true,
                message: "Congratulations your email verified Successfuly"
            })
        } else {
            throw new Error("Wrong Code")
        }
    } catch(err) {
        next(new ApiError(err.message, 400))
    }

}

// @desc    Send Verification Email
// @route   POST /api/users/send-verify-email
// @access  Private
async function sendVerificationEmail(req, res, next) {
    try {

        const user = req.user;

         // Create a CODE
        const verifyCode = `${Math.floor(Math.random() * 900000) + 100000}`;
        const verifyCodeExpire = new Date(Date.now() + 60 * 60 * 1000); // Add 1 Hour

        user.verifyCode = verifyCode;
        user.verifyCodeExpire = verifyCodeExpire;
        await user.save()

        await sendMail({ 
            to: user.email, 
            subject: "Email Verification", 
            html: verifyEmailTemplate
                    .replace('{verify_code}', verifyCode)
                    .replace('{first_name}', user.name.split(' ')[0]) 
        })

        res.send({
            success: true,
            message: 'We have sent verify code to ' + user.email
        })

    } catch(err) {
        next(new ApiError(err.message, 400))
    }
}

// @desc    Send Reset Password Mail
// @route   POST /api/users/forgot-password
// @access  Public
async function forgotPassword(req, res, next) {
    const { username } = req.body;
    try {
        const user = await Users.findOne({ username })
        if (!user) throw new Error("Can't find user with username " + username)
        let token = crypto.randomBytes(20).toString("hex")
        user.resetPasswordToken = token
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000
        await user.save()
        await sendMail({ 
            to: user.email,
            subject: "Reset Password", 
            html: resetPasswordTemplate
                    .replace('{reset_link}', process.env.CLIENT_URL + `/reset-password/${token}?allow=${Date.now() + 60*60*1000}`)
                    .replace('{first_name}', user.name.split(' ')[0]) 
        })
        const hashedMail = user.email.split('@')[0].split("").map((letter, index, arr) => {
            if (index > 2 && index < arr.length - 2) return '*'
            else return letter
        }).join("") + '@' + user.email.split('@')[1]
        res.send({
            success: true,
            message: 'We have sent reset email to ' + hashedMail
        })
    } catch(err) {
        next(new ApiError(err.message, 400))
    }
}

// @desc    Reset Password
// @route   POST /api/users/reset-password/:token
// @access  Public
async function resetPassword(req, res, next) {
    try {
        const { token } = req.params
        const { password } = req.body
        const user = await Users.findOne({ resetPasswordToken: token })

        if (!user) throw new Error("Something went wrong")
        if (!password) throw new Error("Please Send The New Password")
        if (user.resetPasswordExpire < (new Date())) throw new Error("Expired Reset Link")
        
        const salt = await bcrypt.genSalt(14)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.password = await bcrypt.hash(password, salt)
        await user.save()
        res.send({
            success: true,
            message: 'Reset Password Successfuly'
        })
    } catch(err) {
        next(new ApiError(err.message, 400))
    }
}

// @desc    Update User
// @route   PUT /api/users
// @access  Private
async function updateUser(req, res, next) {
    try {

        if (Object.keys(req.body).length < 1) {
            throw new Error("Must send at least one property to update")
        }

        if (req.body._id || req.body.id) {
            throw new Error("Can't modify id property")
        }

        if (req.body.username) {
            throw new Error("Can't modify username property")
        }

        if (req.body.emailVerified) {
            throw new Error("Wrong Way to Verify Email please use '/users/verify-email' Route")
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (req.body.email && !emailPattern.test(req.body.email)) {
            throw new Error("Invalid Email")
        }
        
        if (req.body.units) {
            throw new Error("Wrong Way to Update Password please use '/units' Route")
        }

        let body = {...req.body}
        
        
        if (body.newPassword && body.password ) {// if user will Change Password

            if (! await bcrypt.compare(body.password, req.user.password)) {
                throw new Error("Password is Incorrect")
            }

            const salt = await bcrypt.genSalt(14)
            body.password = await bcrypt.hash(body.newPassword, salt)
            delete body.newPassword;

        } else { // Check If Password is Correct
            
            if (!req.body.password) {
                throw new Error("Please Send your password to update your data")
            }

            if (! await bcrypt.compare(req.body.password, req.user.password)) {
                throw new Error("Password is Incorrect")
            }
            delete body.password;
        }

        const emailVerified = body.email ? false : req.user.emailVerified
        const user = await Users.findOneAndUpdate({_id: req.user.id}, {...body, emailVerified }, {new: true}).select("-password")
        res.send({
            success: true,
            message: "User Updated Successfuly",
            user
        })

    } catch(err) {
        let message;
        if (err.code === 11000) {
            let key = Object.keys( err.keyValue )[0]
            message = `${key} must be unique`
        }
        next(new ApiError(message || err.message, 400))
    }
}

// @desc    Delete User
// @route   DELETE /api/users
// @access  Private
async function deleteUser(req, res, next) {

    try {

        await Market.deleteMany({ userId: req.user.id})
        await Unit.deleteOne({ userId: req.user.id})
        await Users.deleteOne({ _id: req.user.id})

        res.send({
            success: true,
            message: `User ${req.user.id} Deleted Successfuly`
        });
    
    } catch(err) {
        next(new ApiError(err.message, 400))
    }

}


module.exports = { 
    register, 
    login, 
    getMe, 
    updateUser, 
    verifyEmail, 
    sendVerificationEmail,
    forgotPassword, 
    resetPassword, 
    deleteUser
}