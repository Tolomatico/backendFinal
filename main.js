// Creamos la clase ProductManager

class ProductManager {

    static ItemId = 1

    constructor() {
        this.products = []
    }

    addProduct(title, description, price, thumbnail, code, stock) {



        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Existen campos vacios,por favor, completarlos")
            return
        }

        if (this.products.some(item => item.code === code)) {
            console.log("El codigo ya existe")
            return
        }

        const newProduct = {
            id: ProductManager.ItemId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct)

    }

    getProducts() {
        console.log(this.products)
        return
    }

    getProductById(id) {
        const product = this.products.find(item => item.id === id)
        if (!product) {
            console.log("No se a encontrado ningún producto con ese id")
        }
        else {
            console.log("El producto con ese id es: ",product)
        }
       
    }

}

const manager = new ProductManager()

manager.getProducts()

manager.addProduct("coca", "gaseosa cola", 200, "Sin imagen", "aaa", 25)
manager.addProduct("pepsi", "gaseosa cola", 200, "Sin imagen", "aaa", 25)
manager.addProduct("sprite", "gaseosa limalimon", 200, "Sin imagen", "bbb", 25)
manager.addProduct("7up", "gaseosa limalimon", 200, "Sin imagen", "ccc", 25)
manager.addProduct("fanta", "gaseosa naranja", 200, "Sin imagen", "ddd",25)
manager.addProduct("mirinda", "gaseosa naranja", 200, "Sin imagen", "eee")


manager.getProducts()

manager.getProductById(0)
manager.getProductById(1)
manager.getProductById(2)

