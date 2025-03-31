const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const { signUpSchema, loginSchema } = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");

// Routes
router.get("/", authControllers.home);
router.post("/register", validate(signUpSchema), authControllers.register);
router.post("/login", validate(loginSchema), authControllers.login);

module.exports = router;
