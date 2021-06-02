const Payments = require("../models/paymentModel");
const Users = require("../models/userModel");
const Products = require("../models/productModel");
const Receipts = require("../models/receiptModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; // queryString = req.query;
    // console.log({ before: queryObj }); // before delete page
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // console.log({ after: queryObj }); // after delete page

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    // console.log({ queryObj, queryStr });

    //  gte = greater than or equal
    //  gt  = greater than
    //  lte = lesser than or equal
    //  lt  = lesser than
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      //console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("createdAt");
    }

    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const paymentCtrl = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payments.find();
      res.json(payments);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPayment: async (req, res) => {
    try {
      const payment = await Payments.findOne({ _id: req.params.id });
      //console.log(req.params.id);
      res.json(payment);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createPayment: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("name email");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const { cart, address, bank, total } = req.body;
      if (cart.length == 0)
        return res.status(400).json({ msg: "Your cart is empty" });
      var paymentID = `PAYID${Date.now()}`;
      const { _id, name, email } = user;

      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        address,
        bank,
        total,
      });

      cart.filter((item) => {
        return sold(item._id, item.quantity, item.sold);
      });
      cart.filter((item) => {
        return reduceStock(item._id, item.quantity, item.stock);
      });

      await newPayment.save();
      res.json({ id: newPayment._id, paymentID: newPayment.paymentID });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updatePaymentStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;
      console.log(status);
      console.log(id);
      await Payments.findOneAndUpdate(
        { _id: req.params.id },
        {
          status,
        }
      );
      res.json({ msg: "Updated a Status Payment." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addReceipt: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("name email");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const { images, paymentID } = req.body;

      const transaction = await Payments.find({ paymentID: paymentID });
      if (!transaction) res.status(400).json({ msg: "PaymentID not Found" });

      console.log(transaction);
      if (!images) return res.status(400).json({ msg: "No image upload" });

      const { _id, name } = user;
      const newReceipt = new Receipts({
        user_id: _id,
        name: name,
        images,
        paymentID: paymentID,
      });

      await newReceipt.save();
      res.json({
        msg: "Thank you for your payment confirmation",
        id: paymentID,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const sold = async (id, quantity, oldSold) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      sold: quantity + oldSold,
    }
  );
};
const reduceStock = async (id, quantity, oldStock) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      stock: oldStock - quantity,
    }
  );
};

module.exports = paymentCtrl;
