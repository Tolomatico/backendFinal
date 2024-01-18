const express =require("express")
const router=express.Router()
const ProductManager = require("../controllers/product-manager.js")
const manager = new ProductManager("./src/models/products.json")

router.get("/realtimeproducts",async (req,res)=>{
    let products = await manager.getProducts()


    res.render("index",{products,title:"Productos"})
})

module.exports=router