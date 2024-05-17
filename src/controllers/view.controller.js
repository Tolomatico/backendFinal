const UserDTO = require("../dto/user.dto.js")
const{ response} = require("../utils/reusables.js")
const productsModel = require("../models/products.model.js")
const transport = require("../config/transport.js")
const CartManager = require("../dao/db/cart-manager-db.js")
const cartManager = new CartManager()
const { totalCart } = require("../utils/equations.js")
const generateProducts = require("../utils/generateProducts.js")
const ProductManager=require("../dao/db/product-manager-db.js")
const manager=new ProductManager()

class ViewController {

    async renderPassrecover(req,res){

        try {
            res.render("passrecover")
        } catch (error) {
            response(res,404,"No se pudo redirigir a restablecer contraseña.")
        }
    }

    async renderHome(req, res) {

        try {

            if (req.user) {
                const userDto = new UserDTO(
                    req.user.first_name,
                    req.user.last_name,
                    req.user.email,
                    req.user.rol
                )

                const isAdmin = req.user.rol === 'admin'
                const isUser=req.user.rol ==="user"
                const isPremium=req.user.rol ==="premium"

                res.render("index", { user: userDto, isAdmin: isAdmin,isPremium:isPremium,isUser:isUser })
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
                return { id: _id, ...rest }
            })

            if (req.user) {
                const userDto = new UserDTO(
                    req.user.first_name,
                    req.user.last_name,
                    req.user.email,
                    req.user.rol,
                    req.user.cart
                )

                const cartId = req.user.cart


                const isAdmin = req.user.rol === 'admin'
            const isUser=req.user.rol ==="user"
            const isPremium=req.user.rol ==="premium"
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
                    isAdmin: isAdmin,isPremium:isPremium,isUser:isUser,
                    cart: cartId
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
                    title: "Productos",
                    

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
                    req.user.rol,

                )

                const isAdmin = req.user.rol === 'admin'
            const isUser=req.user.rol ==="user"
            const isPremium=req.user.rol ==="premium"
                res.render("realTimeProducts", {
                    title: "Productos actualizados en tiempo real",
                    user: userDto,
                    isAdmin: isAdmin,isPremium:isPremium,isUser:isUser
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

    async renderCarts(req,res){
        res.render("carts")

    }

    async renderCart(req, res) {
        const id = req.params.id
        
        try {

           
            const userDto = new UserDTO(
                req.user.first_name,
                req.user.last_name,
                req.user.email,
                req.user.rol,
                req.user.cart

            )
            const isAdmin = req.user.rol === 'admin'
            const isUser=req.user.rol ==="user"
            const isPremium=req.user.rol ==="premium"
            const cart = await cartManager.getCartById(id)

            if (!cart) {
                return response(res, 404, "No se a encontrado un carrito con ese id")
            }

            let total = 0

            const cartProducts = cart.products.map(item => {
                const product = item.product.toObject()
                const quantity = item.quantity
                const totalPrice = product.price * quantity

                total += totalPrice

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    id: id.toString()
                }
            })


            res.render("carts", {
                cart: cartProducts,
                totalCart: totalCart(cartProducts),
                id,
                user: userDto,
                isAdmin: isAdmin,isPremium:isPremium,isUser:isUser
            }
            )

        } catch (error) {
            response(res, 500, `Error al obtener el carrito: ${error}`)
        }
    }

    async mockingProducts(req, res) {
        try {

            const products = []
            for (let i = 0; i < 100; i++) {
                products.push(generateProducts())
            }

            res.json(products)

        } catch (error) {
            response(res, 404, "Error al cargar productos del mock")
        }
    }

    async renderLogger(req, res) {

            res.send("Test")
            req.logger.error("Error logger")
            req.logger.info("Info logger")
            req.logger.debug("Debug logger")
            req.logger.warn("Warning logger")
     
    }
    async renderMessage(req,res){
        res.render("message")
    }

    
}

module.exports = ViewController