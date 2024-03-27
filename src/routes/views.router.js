const express = require("express")
const router = express.Router()
const CartManager = require("../dao/db/cart-manager-db.js")
const manager = new CartManager()
const ProductManager = require("../dao/db/product-manager-db.js")
const productManager = new ProductManager()
const productsModel = require("../models/products.model.js")
const cartsModel = require("../models/carts.model.js")

const response = require("../utils/reusables.js")


router.get("/", async (req, res) => {
    res.render("index", { user: req.session.user })
})

router.get("/products", async (req, res) => {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2


    try {
        const products = await productsModel.paginate({}, { limit, page })
        // const products = await productManager.getProducts({page:parseInt(page),limit:parseInt(limit)})

        const arrayProducts = products.docs.map(product => {
            const { _id, ...rest } = product.toObject()
            return rest
        })

        res.render("products", {
            products: arrayProducts,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
            title: "Productos",
            user: req.session.user
        })


    } catch (error) {
        response(res,500,`Error al obtener los productos: ${error}`)
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
        res.render("carts", {
            cart: cartMap
        }
        )

    } catch (error) {
        response(res,500,`Error al obtener el carrito: ${error}`)
    }


})

router.get("/realtimeproducts", async (req, res) => {

    try {
        res.render("realTimeProducts", {
            title: "Productos actualizados en tiempo real",
            user: req.session.user
        })

    } catch (error) {
        response(res,500,`Error al obtener los productos: ${error}`)
    }

})

router.get("/chat", async (req, res) => {

    try {
        res.render("chat")
    } catch (error) {
        response(res,500,`Error al ingresar al chat: ${error}`)
    }

})

router.get("/register", async (req, res) => {
    try {
        if (req.session.login) {

            return res.redirect("/products")
        }
        res.render("register")

    } catch (error) {
        response(res,500,`Error al intentar registrarse: ${error}`)
    }

})

router.get("/login", async (req, res) => {
    try {
        if (req.session.login) {
            return res.redirect("/products")
        }
        res.render("login")

    } catch (error) {
        response(res,500,`Error al intentar registrarse: ${error}`)
    }


})

router.get("/profile", async (req, res) => {

    if (req.session.user) {
        res.render("profile", { user: req.session.user })
    } else res.redirect("/login")

})



module.exports = router