const express = require("express")
const router = express.Router()

const CartManager = require("../controllers/cart-manager.js")
const manager = new CartManager("./src/models/carts.json")

router.get("/carts",async (req,res)=>{
    try{
        const carts=await manager.getCarts()
        res.json(carts)

    }catch{
        console.error("error al obterner carrito",error)
        res.json({error:"Error en el servidor"})
    }

})

router.post("/carts", async(req,res)=>{
    
    try {
     const newCart= await manager.newCart()
     res.status(201).json(newCart)
    } catch (error) {
        res.status(500).send({ status: "error",  error })
}})

router.get("/carts/:id",async(req,res)=>{
    let id=parseInt(req.params.id)
    const cartSearchedById= await manager.getCartById(id)
    if(cartSearchedById){
        res.send(cartSearchedById)
    }else{
        res.send({error:"Carrito no encontrado"})
    }

})

router.post("/:cid/product/:pid",async (req,res)=>{

    const cartId= req.params.cid
    const productId=req.params.pid
    const quantity=req.body.quantity || 1

    try {
        const cartUpdate= await manager.addProducts(cartId,productId,quantity)
        res.send(cartUpdate)
    } catch (error) {
        console.log("Error al agregar al carrito",error)     
    }

})

   





module.exports = router