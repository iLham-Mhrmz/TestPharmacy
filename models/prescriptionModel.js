const mongoose = require('mongoose')


const prescriptionSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    phoneNumber:{
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


module.exports = mongoose.model("Prescriptions", prescriptionSchema)