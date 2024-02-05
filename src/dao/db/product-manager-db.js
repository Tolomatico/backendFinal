const productsModel=require("../models/products.model.js")

class ProductManager {

    static ItemId = 1

    constructor(path) {
        this.products = [],
            this.path = path
    }

    async addProduct(product) {

        
        let { title, description, price, thumbnail, code, stock,status,category } = product


        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            console.log("Existen campos vacios,por favor, completarlos")
            return
        }

        const productoExistente= await productsModel.findOne({code:code})
        if(productoExistente){
            console.log("El codigo debe ser único")
            return
        }


        const newProduct =new productsModel ({
            title,
            description,
            img,
            price,
            thumbnail:thumbnail || [],
            status,
            code,
            stock,
            category
        })
        await newProduct.save()

    }

  async getProducts() {

    try {
        const products=await productsModel.find()
        return products
    } catch (error) {
        console.log("Error al recibir los productos",error)
    }
}

    async getProductById(id) {

        try {
            const product=await productsModel.findByid(id)
            if(product){
                return product
            }else{
                console.log("No se encontro el producto")
                return null
            }
            
        } catch (error) {
            console.log("Error al buscar producto por id", error)
        }

    }

  
    async updateProduct(id, updatedProduct) {
        try {

        const updated= await productsModel.findByIdAndUpdate(id,updatedProduct)

        if(!updated){
            console.log("No se encuentra el producto a actualizar")
            return null
        }
        console.log("Producto actualizado con éxito")
            return updated
        } catch (error) {
           console.log("Error al actualizar",error)
        }
    }


    async deleteProduct(id) {
        try {
            const deleted = await productsModel.findByIdAndDelete(id)

            if(!deleted){
                console.log("No se encuentra el producto a eliminar")
                return null
            }
            console.log("Producto eliminado con éxito")
                return updated
            } catch (error) {
               console.log("Error al eliminar producto",error)
            }
           
        } catch (error) {
            console.log("Error al borrar", error)
        }
    }


module.exports=ProductManager
