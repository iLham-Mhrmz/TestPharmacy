const Payments = require('../models/paymentModel')
const Users = require('../models/userModel')
const Products = require('../models/productModel')
const productCtrl = require('./productCtrl')


const paymentCtrl = {
    getPayments: async(req, res) =>{
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createPayment: async(req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email')
            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            
            const {cart, address, bank} = req.body;
            if(cart.length == 0) return res.status(400).json({msg: "Your cart is empty"})
            var paymentID = `PAYID${Date.now()}`
            const {_id, name, email} = user;

            const newPayment = new Payments({
                user_id: _id, name, email, cart, paymentID, address, bank
            })

            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold)
            })
            cart.filter(item => {
                console.log(item.quantity)
                console.log(item.stock)
                return reduceStock(item._id, item.quantity, item.stock)
            })
            
            await newPayment.save()
            res.json({msg: "Payment Succes!"})
            
        } catch (err) {
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
