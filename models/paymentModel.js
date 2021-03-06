const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    paymentID:{
        type: String,
        required: true
    },
    bank:{
        type: String,
        required: true
    },
    address:{
        type: Object,
        required: true
    },
    cart:{
        type: Array,
        default: []
    },
    total: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        default: "Pending"
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Payments", paymentSchema)