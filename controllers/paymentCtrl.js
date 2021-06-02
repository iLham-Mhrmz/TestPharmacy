const Payments = require('../models/paymentModel')
const Users = require('../models/userModel')
const Products = require('../models/productModel')
const Receipts = require('../models/receiptModel')

const paymentCtrl = {
    getPayments: async(req, res) =>{
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPayment: async(req,res) => {
        try {
            const payment = await Payments.findOne({paymentID: req.params.id})
            console.log(req.params.id)
            console.log(payment)
            res.json({payment})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }

    },
    createPayment: async(req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email')
            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            
            const {cart, address, bank, total} = req.body;
            if(cart.length == 0) return res.status(400).json({msg: "Your cart is empty"})
            var paymentID = `PAYID${Date.now()}`
            const {_id, name, email} = user;

            const newPayment = new Payments({
                user_id: _id, name, email, cart, paymentID, address, bank, total
            })

            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold)
            })
            cart.filter(item => {
                return reduceStock(item._id, item.quantity, item.stock)
            })
            
            await newPayment.save()
            res.json({id: newPayment._id, paymentID: newPayment.paymentID})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    addReceipt: async(req, res) => {
        try{
            const user = await Users.findById(req.user.id).select('name email')
            if(!user) return res.status(400).json({msg: "User does not exist."})

            const { images, paymentID} = req.body

            const transaction = await Payments.find({paymentID: paymentID})
            if(!transaction) res.status(400).json({msg: "PaymentID not Found"})
            
            console.log(transaction)
            if(!images) return res.status(400).json({msg: "No image upload"})

            const {_id, name} = user;
            const newReceipt = new Receipts({
                user_id: _id, name: name, images, paymentID: paymentID
            })


            await newReceipt.save()
            res.json({msg: "Thank you for your payment confirmation", id: paymentID})
        } catch (err){
            return res.status(500).json({msg: err.message})
        }
    } 
    
}

const sold = async (id, quantity, oldSold) =>{
    await Products.findOneAndUpdate({_id: id}, {
        sold: quantity + oldSold
    })
}
const reduceStock = async (id, quantity, oldStock) =>{
    await Products.findOneAndUpdate({_id: id}, {
        stock : oldStock - quantity
    })
}

module.exports = paymentCtrl
