const express = require("express")
const router = express.Router()
const ProductController=require("../controllers/product.controller.js")
const productController=new ProductController()


router.get("/:id",productController.getProductById)
router.get("/",productController.getProducts)
router.post("/",productController.subirArchivo.bind(productController),productController.newProduct)
router.put("/:id", productController.updateProduct)
router.delete("/:id", productController.deleteProduct)



module.exports = router