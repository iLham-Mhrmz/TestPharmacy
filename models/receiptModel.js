const mongoose = require('mongoose')


const receiptSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    paymentID:{
        type: String,
        required: true
    },
    images:{
        type: Object,
        required: true
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Receipt", receiptSchema)