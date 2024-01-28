const express =require("express")
const router=express.Router()
const ProductManager = require("../controllers/product-manager.js")
const manager = new ProductManager("./src/models/products.json")

router.get("/",async (req,res)=>{
    let products = await manager.getProducts()


    res.render("index",{products,title:"Productos"})
})

router.get("/realtimeproducts",async (req,res)=>{
    
    try {
        res.render("realTimeProducts",{title:"Productos actualizados en tiempo real"})

    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }

})

router.get("/chat", async (req,res)=>{

    try {
        res.render("chat")
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }

})

module.exports=router