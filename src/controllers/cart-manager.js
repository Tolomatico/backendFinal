const fs = require("fs").promises

class CartManager {

    constructor(path) {
        this.path = path,
            this.carts = []

        this.loadCarts()
    }

    async newCart() {

        this.carts = await this.loadCarts()

        const maxId = Math.max(...this.carts.map(item => item.id))

        const cart = {
            id: this.carts.length > 0 ? maxId + 1 : 1,
            products: []
        }

        this.carts.push(cart)
        await this.saveCarts(this.carts)
        return cart
    }

    async getCartById(id) {

        this.carts = await this.loadCarts()
        const cart = this.carts.find(item => item.id == id)
        if (!cart) {
            console.log("No se encontro ningún carrito con ese id")
        } else {
            return cart
        }

    }

    async addProducts(cid, pid, quantity) {
        
            const cartIdSearched = await this.getCartById(cid)
        
            if (cartIdSearched) {
                const productIndex = cartIdSearched.products.findIndex(item => item.product == pid)
    
                if (productIndex !== -1) {
                   
                    cartIdSearched.products[productIndex].quantity = cartIdSearched.products[productIndex].quantity + quantity
                } else {
                    
                    cartIdSearched.products.push({
                        product: parseInt(pid),
                        quantity: quantity
                    })
                }
    
                this.carts = await this.getCarts()
    
                const cartIndex = this.carts.findIndex(cart => cart.id == cid)
    
                if (cartIndex !== -1) {
                    this.carts[cartIndex] = cartIdSearched
                    await this.saveCarts(this.carts)
                } else {
                    console.log("Error: No se encontró el carrito para actualizar")
                }
            } else (console.log("Error: No se encontro el carrito con ese id"))
        
    }

    async getCarts() {
        return this.carts = await this.loadCarts()

    }

    async loadCarts() {
        try {

            const res = await fs.readFile(this.path, ("utf-8"))
            const carts = JSON.parse(res)

            return carts
        } catch (error) {
            console.log("Error al cargar el carrito", error)
        }

    }

    async saveCarts(carts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2))

        } catch (error) {
            console.log("Error al guardar el carrito")
        }

    }

}

module.exports = CartManager