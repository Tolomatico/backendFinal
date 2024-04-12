const UserDTO = require("../dto/user.dto.js")
const response = require("../utils/reusables.js")
const productsModel = require("../models/products.model.js")
const transport = require("../config/transport.js")
const CartManager = require("../dao/db/cart-manager-db.js")
const cartManager=new CartManager()

class ViewController {

    async renderHome(req, res) {

        try {

            if (req.user) {
                const userDto = new UserDTO(
                    req.user.first_name,
                    req.user.last_name,
                    req.user.email,
                    req.user.rol
                )

                const isAdmin = req.user.rol === 'admin';

                res.render("index", { user: userDto, isAdmin: isAdmin })
            } else {
                res.render("index")
            }

        } catch (error) {
            res.status(500).json({ message: `Error al cargar la página:${error}` })
        }
    }

    async renderLogin(req, res) {
        res.render("login")
    }

    async renderRegister(req, res) {
        res.render("register")
    }

    async renderChat(req, res) {

        try {
            res.render("chat")
        } catch (error) {
            response(res, 500, `Error al ingresar al chat: ${error}`)
        }
    }

    async renderProducts(req, res) {

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2


        try {
            const products = await productsModel.paginate({}, { limit, page })
            // const products = await productManager.getProducts({page:parseInt(page),limit:parseInt(limit)})

            const arrayProducts = products.docs.map(product => {
                const { _id, ...rest } = product.toObject()
                return rest
            })

            if (req.user) {
                const userDto = new UserDTO(
                    req.user.first_name,
                    req.user.last_name,
                    req.user.email,
                    req.user.rol
                )

                const isAdmin = req.user.rol === 'admin';
                res.render("products", {
                    products: arrayProducts,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    prevPage: products.prevPage,
                    nextPage: products.nextPage,
                    currentPage: products.page,
                    totalPages: products.totalPages,
                    title: "Productos",
                    user: userDto,
                    isAdmin: isAdmin
                })

            } else {
                res.render("products", {
                    products: arrayProducts,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    prevPage: products.prevPage,
                    nextPage: products.nextPage,
                    currentPage: products.page,
                    totalPages: products.totalPages,
                    title: "Productos"

                })
            }
        } catch (error) {
            response(res, 500, `Error al obtener los productos: ${error}`)
        }
    }

    async renderRealTimeProducts(req, res) {

        try {
            if (req.user) {
                const userDto = new UserDTO(
                    req.user.first_name,
                    req.user.last_name,
                    req.user.email,
                    req.user.rol
                )

                const isAdmin = req.user.rol === 'admin'
                res.render("realTimeProducts", {
                    title: "Productos actualizados en tiempo real",
                    user: userDto,
                    isAdmin: isAdmin
                })

            }
        } catch (error) {
            response(res, 500, `Error al obtener los productos: ${error}`)
        }
    }

    async renderMail(req, res) {
        try {
            await transport.sendMail({
                from: "Tomás Ballesty <ballesty.t@gmail.com",
                to: "tolomagnanimo@gmail.com",
                subject: "Correo de prueba",
                html: `<h1>Prueba de mail</h1>`,
                attachments: [{
                    filename: "coca.webp",
                    path: "./src/public/img/coca.webp",
                    cid: "coca"
                }]
            })
            response(res, 200, "Correo enviado")

        } catch (error) {
            response(res, 500, `Error al enviar mail: ${error}`)
        }
    }

    async renderCart(req, res) {
        const id = req.params.id

        try {
            const cart = await cartManager.getCartById(id)
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
            response(res, 500, `Error al obtener el carrito: ${error}`)
        }
    }

}

module.exports = ViewController