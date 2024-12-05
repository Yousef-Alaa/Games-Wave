const mongoose = require("mongoose")

const unitsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'User Id is Required']
    },
    pc: mongoose.Schema({
        count: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            default: 0
        }
    }, { _id : false }),
    ps4: mongoose.Schema({
        count: {
            type: Number,
            default: 1
        },
        singlePrice: {
            type: Number,
            default: 0
        },
        multiPrice: {
            type: Number,
            default: 0
        }
    }, { _id : false }),
    ps5: mongoose.Schema({
        count: {
            type: Number,
            default: 1
        },
        singlePrice: {
            type: Number,
            default: 0
        },
        multiPrice: {
            type: Number,
            default: 0
        }
    }, { _id : false })
}, {
    toJSON: {
        transform(doc, ret){
            delete ret._id
            delete ret.userId
            delete ret.__v
        }
    }
})

module.exports = mongoose.model("Unit", unitsSchema)