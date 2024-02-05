const cartsModel= require("../models/carts.model.js")

class CartManager {

    async newCart() {

      carts = await this.loadCarts()

        

        const cart = {
            id: this.carts.length > 0 ? maxId + 1 : 1,
            products: []
        }

        
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
        try {  
             const carts= await cartsModel.find()
            if(!carts){
                console.log("Error al recibir los carritos")
                return null
            }
            return carts
            
        } catch (error) {
            
        }

    }

    

   

}

module.exports = CartManager