const express = require("express")
const router = express.Router()
const UserController = require("../controllers/user.controller.js")
const userController = new UserController()


router.post("/register", userController.register.bind(userController))
router.post("/login", userController.login.bind(userController))
router.get("/logout", userController.logout.bind(userController))
router.get("/profile", userController.profile.bind(userController))

module.exports = router