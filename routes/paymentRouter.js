const router = require("express").Router();
const paymentCtrl = require("../controllers/paymentCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/payment")
  .get(auth, authAdmin, paymentCtrl.getPayments)
  .post(auth, paymentCtrl.createPayment);
router.get("/payment/:id", auth, paymentCtrl.getPayment);
router.post("/payment/upload_receipt", auth, paymentCtrl.addReceipt);
router.put("/payment/:id", auth, paymentCtrl.addReceipt);

module.exports = router;
