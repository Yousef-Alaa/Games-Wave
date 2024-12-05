const mongoose = require("mongoose");


const marketSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'User Id is Required']
    }, 
    localId: {
        type: String,
        required: [true, 'Local Id is Required']
    },
    name: {
        type: String,
        required: [true, 'Name is Required']
    }, 
    price: {
        type: Number,
        required: [true, 'Price is Required']
    }, 
    icon: {
        type: String,
        required: [true, 'Icon is Required']
    },
    stowage: {
        type: Number,
        required: [true, 'Stowage is Required']
    }
}, { 
    collection: 'market',
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})

module.exports = mongoose.model("Market", marketSchema)