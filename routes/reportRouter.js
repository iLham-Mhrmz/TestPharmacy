const router = require("express").Router();
const reportCtrl = require("../controllers/reportCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/reports")
  .get(auth, authAdmin, reportCtrl.getReports)
  .post(auth, authAdmin, reportCtrl.createReport);

router
  .route("/reports/:id")
  .delete(auth, authAdmin, reportCtrl.deleteReport)
  .put(auth, authAdmin, reportCtrl.updateReport);

module.exports = router;
