const UserDTO = require("../dto/user.dto.js")
const response = require("../utils/reusables.js")
const productsModel = require("../models/products.model.js")

class ViewController {

    async renderHome(req, res) {

        try {

            if (req.user) {
                const userDto = new UserDTO(
                    req.user.first_name,
                    req.user.last_name,
                    req.user.age,
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
                    req.user.age,
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
                    req.user.age,
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
        }catch (error) {
            response(res, 500, `Error al obtener los productos: ${error}`)
        }


}}

module.exports = ViewController