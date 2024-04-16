const response = require("../utils/reusables.js")
const ticketModel = require("../models/ticket.model")
const { generateCode } = require("../utils/equations")
const usersModel = require("../models/users.model.js")
const CartManager = require("../dao/db/cart-manager-db.js")
const cartManager = new CartManager()
const ProductManager = require("../dao/db/product-manager-db.js")
const productManager = new ProductManager()

class CartController {

    async finishPurchase(req, res) {
        const cartId = req.params.cid
        try {

            const cart = await cartManager.getCartById(cartId)
            const products = cart.products
            const user = await usersModel.findOne({ cart: cartId })

            const noStockProducts = []


            for (const item of products) {
                const id = item.product
                const product = await productManager.getProductById(id)
                if (product.stock < item.quantity) {
                    noStockProducts.push(item)

                } else {

                    product.stock = product.stock - item.quantity
                    product.save()
                }
            }
          
            cart.products=cart.products.filter(item=>noStockProducts.some(item2=>item2.product._id !== item.product._id))

            await cart.save()

            const amount = cart.products.reduce((acc, item) => {
                return acc + (item.product.price * item.quantity)
            }, 0)


            if (cart) {
                const ticket = new ticketModel({
                    code: generateCode(),
                    purchase_datetime: Date.now(),
                    amount: amount,
                    purchaser: user._id
                })
                

                await ticket.save()
                response(res, 201, `Se ah generado el ticket correctamente: ${ticket}`)

            } else {


                response(res, 404, `No se ah podido generar el ticket`)
            }



        } catch (error) {
            response(res, 404, `Error al generar el ticket: ${error}`)
        }

    }

    async getCarts(req, res) {
        try {
            const carts = await cartManager.getCarts()
            res.json(carts)

        } catch {
            console.error("error al obterner carrito", error)
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

        try {
            const product = await cartManager.addProducts(cartId, productId, quantity)
            response(res, 201, "Se agrego el producto al carrito")

        } catch (error) {
            console.log("Error al agregar al carrito", error)
        }
    }

    async deleteProduct(req, res) {
        const cid = req.params.cid
        const pid = req.params.pid

        try {
            const productToDelete = await cartManager.deleteProductFromCart(cid, pid)
            res.send(productToDelete)
        } catch (error) {
            console.log("Error al borrar el producto", error)
        }
    }

    async emptyCart(req, res) {
        const cid = req.params.cid

        try {
            const emptyCart = await cartManager.emptyCart(cid)
            res.send(emptyCart)
        } catch (error) {
            console.log("Error al vaciar el carrito")
        }
    }

    async updateProducts(req, res) {
        const cid = req.params.cid
        const products = req.body

        try {
            const updateProducts = await cartManager.updateProductsFromCart(cid, products)
            res.send(updateProducts)

        } catch (error) {
            console.log("Error al querer agregar productos", error)
        }
    }

    async updateProduct(req, res) {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity

        try {
            const productQuantityModified = await cartManager.updateCartProduct(cid, pid, quantity)
            res.send(productQuantityModified)

        } catch (error) {
            console.log("Error al querer modificar la cantidad del producto", error)
        }
    }



}

module.exports = CartController