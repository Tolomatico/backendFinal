const express = require("express")
const router = express.Router()
const UserController = require("../controllers/user.controller.js")
const { uploads } = require("../utils/multer.js")
const userController = new UserController()


router.get("/",userController.getUsers)
router.post("/register", userController.register.bind(userController))
router.post("/login", userController.login.bind(userController))
router.get("/logout", userController.logout.bind(userController))
router.get("/profile",userController.profile.bind(userController))
router.post("/recover",userController.recover.bind(userController))
router.get("/recoverpassword",userController.getRecover.bind(userController))
router.post("/recoverpassword",userController.recoverPassword.bind(userController))
router.put("/premium/:uid",userController.changeRole.bind(userController))
router.get("/current",userController.current)
router.post("/:id/documents",uploads ,userController.uploadDocuments)
router.delete("/:id",userController.deleteUser)
module.exports = router


