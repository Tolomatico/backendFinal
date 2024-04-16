const express = require("express")
const router = express.Router()

const ViewController = require("../controllers/view.controller.js")
const viewController = new ViewController()
const checkrole = require("../middleware/checkrol.js")

router.get("/", viewController.renderHome)
router.get("/register", viewController.renderRegister)
router.get("/login", viewController.renderLogin)
router.get("/products", checkrole(["user"]), viewController.renderProducts)
router.get("/realtimeproducts", checkrole(["admin"]), viewController.renderRealTimeProducts)
router.get("/chat", checkrole(["user"]), viewController.renderChat)
router.get("/mailing", viewController.renderMail)
router.get("/carts/:id", viewController.renderCart)
















module.exports = router