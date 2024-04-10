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



router.get("/",viewController.renderHome)
router.get("/register",viewController.renderRegister)
router.get("/login", viewController.renderLogin)
router.get("/products",viewController.renderProducts)

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
        res.render("carts", {
            cart: cartMap
        }
        )

    } catch (error) {
        response(res,500,`Error al obtener el carrito: ${error}`)
    }


})

router.get("/realtimeproducts", viewController.renderRealTimeProducts)

router.get("/chat", async (req, res) => {

    try {
        res.render("chat")
    } catch (error) {
        response(res,500,`Error al ingresar al chat: ${error}`)
    }

})







 const transport=require("../config/transport.js")


router.get("/mailing", async (req,res)=>{
    try {
        await transport.sendMail({
            from:"Tomás Ballesty <ballesty.t@gmail.com",
            to:"tolomagnanimo@gmail.com",
            subject:"Correo de prueba",
            html:`<h1>Prueba de mail</h1>`,
            attachments:[{
                filename:"coca.webp",
                path:"./src/public/img/coca.webp",
                cid:"coca"
            }]
        })
        response(res,200,"Correo enviado")
        
    } catch (error) {
        response(res,500,`Error al enviar mail: ${error}`)
    }
})


 




module.exports = router