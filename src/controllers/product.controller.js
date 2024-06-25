const ProductManager = require("../dao/db/product-manager-db.js")
const manager = new ProductManager()
const { upload } = require("../utils/multer.js")
const transport = require("../config/transport.js")
const UserManager = require("../dao/db/user-manager-db.js")
const userManager = new UserManager()
class ProductController {

    async subirArchivo(req, res, next) {
        upload(req, res, function (error) {
            if (error) {
                res.json({ mensaje: error })
            }

            return next()
        })
    }
    async newProduct(req, res) {
        const newProduct = req.body

        try {
            if (req.file) {
                newProduct.thumbnail = req.file.filename
            }

            await manager.addProduct(newProduct)

            return res.status(201).json({ status: "success", message: "Producto creado correctamente" });

        } catch (error) {
            res.status(400).json({ status: "error", error: "Error al crear el producto" });
        }
    }


    async getProductById(req, res) {
        let id = req.params.id

        const productSearchedById = await manager.getProductById(id)

        if (productSearchedById) {
            res.send(productSearchedById)
        } else {
            res.send({ error: "Producto no existe" })
        }
    }
    async getProducts(req, res) {

        let limit = req.query.limit

        const products = await manager.getProducts()

        if (limit) {
            const productsLimit = products.slice(0, limit)
            res.send(productsLimit)
        } else {
            res.send(products)
        }
    }

    async updateProduct(req, res) {
        const { id } = req.params;
        const { title, description, price, thumbnail, status, code, stock } = req.body;
        const updatedProduct = { title, description, price, thumbnail, status, code, stock };

        try {
            await manager.updateProduct(id, updatedProduct)
            res.status(200).json({ status: "success", message: "Producto actualizado correctamente" })
        } catch (error) {
            res.status(400).send({ status: "error", error: "Error al actualizar el producto" })
        }
    }
    async deleteProduct(req, res) {
        const { id } = req.params

        try {

            const product = await manager.getProductById(id)
            const user = await userManager.get({ email: product.owner })

            if (user.rol === "premium") {
                transport.sendMail({
                    from: "BackendCoderhouse",
                    to: user.email,
                    subject: "Producto Eliminado",
                    text: "Producto eliminado",
                    html: `
                    <p>Hola , el producto ${product.title} ah sido eliminado.</p>
                `
                })
            }


            await manager.deleteProduct(id)
            res.status(200).json({ status: "success", message: "Producto eliminado correctamente" })
        } catch (error) {
            res.status(400).send({ status: "error", error: "Error al borrar el producto" })
        }
    }

}

module.exports = ProductController