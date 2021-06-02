const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/register", userCtrl.register);

router.post("/activation", userCtrl.activateEmail);

router.post("/login", userCtrl.login);

router.get("/logout", userCtrl.logout);

router.get("/refresh_token", userCtrl.refreshToken);

router.post("/forgot", userCtrl.forgotPassword);

router.post("/reset", auth, userCtrl.resetPassword);

router.get("/infor", auth, userCtrl.getUser);

router.get("/all", userCtrl.getAllUser);

router.delete("/delete/:id", auth, authAdmin, userCtrl.deleteUser);

router.patch("/update_status/:id", auth, authAdmin, userCtrl.updateUsersStatus);

router.patch("/addcart", auth, userCtrl.addCart);

router.get("/history", auth, userCtrl.history);

module.exports = router;