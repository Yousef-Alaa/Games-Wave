const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Is Required"]
    },
    username: {
        type: String,
        required: [true, "Username Is Required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email Is Required"],
        unique: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, "Password Is Required"]
    },
    profilePhoto: String,
    verifyCode: String,
    verifyCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id
            delete ret._id
            delete ret.verifyCode
            delete ret.verifyCodeExpire
            delete ret.resetPasswordToken
            delete ret.resetPasswordExpire
            delete ret.__v
        }
    }
})

module.exports = mongoose.model("User", userSchema)
