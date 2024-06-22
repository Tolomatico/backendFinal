const { response } = require("../utils/reusables.js")
const ticketModel = require("../models/ticket.model")
const { generateCode, totalAmount } = require("../utils/equations")
const usersModel = require("../models/users.model.js")
const CartManager = require("../dao/db/cart-manager-db.js")
const cartManager = new CartManager()
const ProductManager = require("../dao/db/product-manager-db.js")
const productManager = new ProductManager()
const UserManager = require("../dao/db/user-manager-db.js")
const userManager = new UserManager()



class CartController {

    async finishPurchase(req, res) {
        const cartId = req.params.cid
        try {

            const cart = await cartManager.getCartById(cartId)
            let products = cart.products
            const user = await userManager.get({ cart: cartId })

            const noStockProducts = []
            const stockProducts = []

            for (const item of products) {
                const id = item.product
                const product = await productManager.getProductById(id)
                if (product.stock >= item.quantity) {

                    product.stock = product.stock - item.quantity
                    product.save()
                    stockProducts.push(item)

                } else {
                    noStockProducts.push(item)

                }


            }
            cart.products = []
            await cart.save()

            const ticket = new ticketModel({
                code: generateCode(),
                purchase_datetime: Date.now(),
                amount: totalAmount(stockProducts),
                purchaser: user._id
            })

            await ticket.save()

            res.status(201).json({ status: "success", message: "Ticket Generado con éxito", payload: ticket })


        } catch (error) {
            res.status(404).json({ status: "error", error: "Error al generar el ticket" })
        }

    }

    async getCarts(req, res) {
        try {
            const carts = await cartManager.getCarts()
            res.json(carts)

        } catch {

            res.json({ error: "Error en el servidor" })
        }

    }
    async newCart(req, res) {
        try {
            const newCart = await cartManager.newCart()
            res.status(201).json(newCart)
        } catch (error) {
            res.status(500).send({ status: "error", error })
        }

    }

    async cartById(req, res) {
        let id = req.params.id
        const cartSearchedById = await cartManager.getCartById(id)
        if (cartSearchedById) {
            res.send(cartSearchedById)
        } else {
            res.send({ error: "Carrito no encontrado" })
        }
    }

    async addProduct(req, res) {
        const cartId = req.params.cid
        const productId = req.params.pid
        const quantity = req.body.quantity || 1
        const { email } = req.user || "test@example.com"



        try {
            const productOwner = await productManager.getProductById(productId)

            const cart = await cartManager.getCartById(cartId)
            const isRepited = cart.products.some(product => product.product._id == productId)
            console.log(isRepited)

            if (!isRepited) {
                
            await cartManager.addProducts(cartId, productId, quantity)

            return res.status(201).json({ status: "success", message: "Se agrego el producto al carrito" })
          
            }
            return res.json({ status: "error", error: "El producto ya está en el carrito" })


        } catch (error) {
            req.logger.error(`Error al agregar el producto:${error}`)
            return res.status(404).json({ status: "error", error: "Error al querer agregar el producto al carrito" })

        }
    }

    async deleteProduct(req, res) {
        const cid = req.params.cid
        const pid = req.params.pid

        try {
            await cartManager.deleteProductFromCart(cid, pid)
            res.status(200).json({ status: "success", message: "Producto elimanado correctamente" });
        } catch (error) {
            res.status(400).json({ status: "error", message: "Oops hubo un error..." })
        }
    }

    async emptyCart(req, res) {
        const cid = req.params.cid

        try {
            const cart = await cartManager.getCartById(cid)
            if (cart.products.length === 0) {
                return res.json({ status: 200, message: "El carrito ya se encuentra vacío" })
            }
            await cartManager.emptyCart(cid)
            res.json({ status: 201, message: "Carrito vaciado" })
        } catch (error) {
            res.json({ status: 404, error: "No se pudo vaciar el carrito" })
        }
    }

    async updateProducts(req, res) {
        const cid = req.params.cid
        const products = req.body

        try {
            const updateProducts = await cartManager.updateProductsFromCart(cid, products)
            res.json(updateProducts)

        } catch (error) {
            res.json({ status: 404, error: "No se pudo actualizar el producto" })
    }}

    async updateProduct(req, res) {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity

        try {
            await cartManager.updateCartProduct(cid, pid, quantity)
            res.status(200).json({ status: "success", message: "Cantidad modificada" })

        } catch (error) {
            res.status(400).json({ status: "error", error: "No se pudo modificar la cantidad" })
        }
    }



}

module.exports = CartController