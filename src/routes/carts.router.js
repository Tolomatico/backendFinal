const express = require("express")
const router = express.Router()

const ProductManager = require("../controllers/product-manager.js")
const manager = new ProductManager("./src/models/carts.json")

router.get("/carts",async (req,res)=>{
    try{
        const carts=await manager.getProducts()
        res.json(carts)

    }catch{
        console.error("error al obterner carrito",error)
        res.json({error:"Error en el servervidor"})
    }

})




module.exports = router