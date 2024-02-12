const express = require("express")
const router = express.Router()

const CartManager = require("../dao/db/cart-manager-db.js")
const manager = new CartManager()

router.get("/",async (req,res)=>{
    try{
        const carts=await manager.getCarts()
        res.json(carts)

    }catch{
        console.error("error al obterner carrito",error)
        res.json({error:"Error en el servidor"})
    }

})

router.post("/", async(req,res)=>{
    
    try {
     const newCart= await manager.newCart()
     res.status(201).json(newCart)
    } catch (error) {
        res.status(500).send({ status: "error",  error })
}})

router.get("/:id",async(req,res)=>{
    let id=req.params.id
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

 router.delete("/:cid/products/:pid", async (req,res)=>{
         const cid = req.params.cid
         const pid= req.params.pid

         
         try {
            const productTodelete= await manager.deleteProductFromCart(cid,pid)
            res.send(productTodelete)
         } catch (error) {
            console.log("Error al borrar el producto",error)
         }
 })

router.delete("/:cid", async (req,res)=>{
    const cid =req.params.cid
    
    try {
        const cartDeleted= await manager.deleteCart(cid)
        res.send(cartDeleted)
    } catch (error) {
        console.log("Error al intentar borrar el carrito")
    }

})

router.put("/:cid", async (req,res)=>{
    const cid = req.params.cid
    const products=req.body
   
    try {
         const updateProducts= await manager.updateProductsFromCart(cid,products)
         res.send(updateProducts)
        
    } catch (error) {
        console.log("Error al querer agregar productos",error)
    }

})

router.put("/:cid/products/:pid", async (req,res)=>{
    const cid=req.params.cid
    const pid=req.params.pid
    const quantity=req.body.quantity 
    
    try {
         const productQuantityModified= await manager.updateCartProduct(cid,pid,quantity)
         res.send(productQuantityModified)
        
    } catch (error) {
        console.log("Error al querer modificar la cantidad del producto",error)
    }

}
)




module.exports = router