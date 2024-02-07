const express = require("express")
const router = express.Router()

const ProductManager = require("../dao/db/product-manager-db.js")

const manager = new ProductManager()

router.get("/:id", async (req, res) => {
    let id = req.params.id

    const productSearchedById = await manager.getProductById(id)

    if (productSearchedById) {
        res.send(productSearchedById)
    } else {
        res.send({ error: "Producto no existe" })
    }

})

router.get("/", async (req, res) => {

     let limit =req.query.limit

    const products = await manager.getProducts()

    if (limit) {
        const productsLimit = products.slice(0, limit)
        res.send(productsLimit)
     } else {
         res.send(products)
   }

})

router.post("/", async (req, res) => {
    const newProduct = req.body

    try {
        await manager.addProduct(newProduct);
        res.send({ status: "success", message: "Producto creado correctamente" });
    } catch (error) {
        res.status(400).send({ status: "error", error });
    }

})

router.put("/:id", async (req, res) => {
    const  {id} = req.params;
    const { title, description, price, thumbnail, status, code, stock } = req.body;
    const updatedProduct = { title, description, price, thumbnail, status, code, stock };
    
    try {
        await manager.updateProduct(id, updatedProduct)
        res.send({ status: "success", message: "Producto actualizado correctamente" })
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message })
    }
})

router.delete("/:id", async (req,res)=>{
    const {id} = req.params
    
    try {
        await manager.deleteProduct(id)
        res.send({ status: "success", message: "Producto eliminado correctamente" })
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message })
    }


})

module.exports = router