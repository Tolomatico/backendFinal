const express = require("express")
const router = express.Router()
const CartController=require("../controllers/cart.controller.js")
const cartController=new CartController()

router.post("/:cid/purchase",cartController.finishPurchase)
router.get("/",cartController.getCarts)
router.post("/", cartController.newCart)
router.get("/:id",cartController.cartById)
router.post("/:cid/product/:pid",cartController.addProduct)
router.delete("/:cid/product/:pid",cartController.deleteProduct)
router.delete("/:cid",cartController.emptyCart)
router.put("/:cid", cartController.updateProducts)
router.put("/:cid/products/:pid",cartController.updateProduct)


module.exports = router