const express = require('express')
const router = express.Router();
const authControllers = require("../controllers/auth-controller")
const signUpSchema = require("../validators/auth-validator")
const validate = require("../middlewares/validate-middleware")


router.route("/").get(authControllers.home);
router.route("/register").post(validate(signUpSchema),authControllers.register);
router.route("/login").post(authControllers.login);



module.exports = router