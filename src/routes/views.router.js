const express = require("express")
const router = express.Router()
const CartManager = require("../dao/db/cart-manager-db.js")
const manager = new CartManager()

const productsModel = require("../models/products.model.js")
const cartsModel = require("../models/carts.model.js")

router.get("/products", async (req, res) => {

    const page = req.query.page || 1
    const limit = req.query.limit || 2


    try {
        const products = await productsModel.paginate({}, { limit, page })
        const arrayProducts = products.docs.map(product => {
            const { _id, ...rest } = product.toObject()
            return rest
        })

        res.render("index", {
            products: arrayProducts,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
            title: "Productos"
        })

    } catch (error) {
        console.log("Error al solicitar los productos", error)
    }


})

router.get("/carts/:id", async (req, res) => {
    const id = req.params.id

    try {
        const cart = await manager.getCartById(id)
        const cartMap = {
            _id: cart._id,
            products: cart.products.map(product => ({
                _id: product._id,
                quantity: product.quantity
            }))
        }

        console.log(cartMap)
        res.render("carts", {
            cart: cartMap
        }
        )
 
    } catch (error) {
        console.log("Error al encontrar el carrito", error)
    }


})

router.get("/realtimeproducts", async (req, res) => {

    try {
        res.render("realTimeProducts", { title: "Productos actualizados en tiempo real" })

    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }

})

router.get("/chat", async (req, res) => {

    try {
        res.render("chat")
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }

})

router.get("/register",async (req,res)=>{
    try {
        if(req.session.login){

           return res.redirect("/products")
        }
        res.render("register")
    
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
   
})

router.get("/login", async (req,res)=>{
    try {
        if(req.session.login){
          return  res.redirect("/products")
        }
        res.render("login")
    
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }


})

router.get("/profile", async (req,res)=>{

    try {
            const user=req.session.user
            res.render("profile",{user})
            
    } catch (error) {
        console.log(error)
    }


})

module.exports = router