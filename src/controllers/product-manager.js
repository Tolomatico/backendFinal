const fs = require("fs").promises


class ProductManager {

    static ItemId = 1

    constructor(path) {
        this.products = [],
            this.path = path
    }

    async addProduct(product) {

         this.products= await this.readFile()

        let { title, description, price, thumbnail, code, stock,status } = product


        if (!title || !description || !price || !thumbnail || !code || !stock || !status) {
            console.log("Existen campos vacios,por favor, completarlos")
            return
        }

        if (this.products.some(item => item.code === code)) {
            console.log("El codigo ya existe")
            return
        }

         const maxId =Math.max(...this.products.map(item=>item.id))
        

        const newProduct = {
            id: maxId+ 1,
            title,
            description,
            price,
            thumbnail,
            status,
            code,
            stock
        }

        this.products.push(newProduct)
        await this.saveFile(this.products)



    }

  async getProducts() {
   
     return this.products=await this.readFile()
        

    }

    async getProductById(id) {

        try {
            const arrayProducts = await this.readFile()
            const product = await arrayProducts.find(item => item.id === id)
            if (!product) {
                console.log("No se a encontrado ningún producto con ese id")
            }
            else {
                console.log("El producto con ese id es")
                return product

            }
        } catch (error) {
            console.log("Error al leer los archivos", error)
        }



    }

    async readFile() {

        try {
            const respuesta = await fs.readFile(this.path, "utf-8")
            const arrayProducts = JSON.parse(respuesta)
            return arrayProducts

        } catch (error) {
            console.log("Error al leer el archivo", error)
        }
    }

    async saveFile(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2))

        } catch (error) {
            console.log("No se pudo guardar el archivo", error)
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const arrayProducts = await this.readFile();
            const { title, description, price, thumbnail, status, code, stock } = await updatedProduct
            const index = await arrayProducts.findIndex(item => item.id == id);

    
            if (index !== -1) {
                arrayProducts[index].title = title
                arrayProducts[index].description = description
                arrayProducts[index].price = price
                arrayProducts[index].thumbnail= thumbnail
                arrayProducts[index].status= status
                arrayProducts[index].code= code
                arrayProducts[index].stock = stock 
               
                await this.saveFile(arrayProducts)
                this.products =  arrayProducts
            } else {
                throw new Error("No se encontró el producto con ese id");
            }
        } catch (error) {
            throw new Error(`Error al actualizar: ${error.message}`);
        }
    }


    async deleteProduct(id) {
        try {
            const arrayProducts = await this.readFile()
            const index = await arrayProducts.findIndex(item => item.id === id)
            if (index !== -1) {
                arrayProducts.splice(index, 1)
                await this.saveFile(arrayProducts)
            } else {
                console.log("No se encontro el producto")
            }

        } catch (error) {
            console.log("Error al borrar", error)
        }
    }

}


module.exports=ProductManager


