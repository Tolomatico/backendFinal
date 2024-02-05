const express =require("express")
const router=express.Router()
const ProductManager = require("../dao/fs/product-manager.js")
const manager = new ProductManager("./dao/fs/products.json")

const productsModel=require("../models/products.model.js")

router.get("/",async (req,res)=>{
    // let products = await manager.getProducts()
    const products= await productsModel.find()
    const arrayProducts=products.map(product =>{
        
        return{
            
            id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            status:product.status,
            category:product.category

        }    
    })
    console.log(arrayProducts)
    
    res.render("index",{arrayProducts,title:"Productos"})
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