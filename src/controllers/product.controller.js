const ProductManager = require("../dao/db/product-manager-db.js")
const manager = new ProductManager()
const upload = require("../utils/multer.js")

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

          const product=await manager.addProduct(newProduct)

            res.json({ status: "success", message: "Producto creado correctamente",payload:product });
        } catch (error) {
            res.status(400).send({ status: "error", error });
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
            res.send({ status: "success", message: "Producto actualizado correctamente" })
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message })
        }
    }
    async deleteProduct(req, res) {
        const { id } = req.params

        try {

            await manager.deleteProduct(id)
            res.send({ status: "success", message: "Producto eliminado correctamente" })
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message })
        }
    }

}

module.exports = ProductController