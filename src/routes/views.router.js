const express = require("express")
const router = express.Router()
const CartManager = require("../dao/db/cart-manager-db.js")
const manager = new CartManager()
const ProductManager = require("../dao/db/product-manager-db.js")
const productManager = new ProductManager()
const productsModel = require("../models/products.model.js")
const cartsModel = require("../models/carts.model.js")
const passport=require("passport")
const response = require("../utils/reusables.js")

const  UserController=require("../controllers/user.controller.js")
const userController=new UserController()
const  ViewController=require("../controllers/view.controller.js")
const viewController=new ViewController()
const checkrole=require("../middleware/checkrol.js")




router.get("/",viewController.renderHome)
router.get("/register",viewController.renderRegister)
router.get("/login", viewController.renderLogin)
router.get("/products",checkrole(["user"]),viewController.renderProducts)
router.get("/realtimeproducts",checkrole(["admin"]) ,viewController.renderRealTimeProducts)
router.get("/chat",checkrole(["user"]), viewController.renderChat)
router.get("/mailing", viewController.renderMail)
router.get("/carts/:id", viewController.renderCart)











 




module.exports = router