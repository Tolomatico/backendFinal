const cartsModel = require("../../models/carts.model.js")

class CartManager {

    async newCart() {
        try {
            const newCart = await cartsModel({ products: [] })
            await newCart.save()
            return newCart
        } catch (error) {
            console.log("Error al crear el nuevo carrito", error)
        }

    }

    async getCartById(id) {
        try {
            const cart = await cartsModel.findById(id)
            if (!cart) {
                console.log("No existe el carrito buscado")
                return null
            }
            return cart
        } catch (error) {
            console.log("Error al buscar el carrito", error)
        }

    }

    async addProducts(cid, pid, quantity = 1) {

        try {
            const cart = await this.getCartById(cid)

           if(!cart){
                console.log("No esxiste un carrito con ese id")
                return null
           }     

            const cartProductExisting =cart.products.find(item => item.product == pid)
            if(cartProductExisting){
                cartProductExisting.quantity += quantity
            }else{
                cart.products.push({product:pid,quantity})
            }
            cart.markModified("products")

            await cart.save()
            return cart 
          } catch (error) {
            console.log("Error al agregar producto", error)
        }
    }

    async getCarts() {
        try {
            const carts = await cartsModel.find()
            if (!carts) {
                console.log("Error al recibir los carritos")
                return null
            }
            return carts

        } catch (error) {

        }

    }





}

module.exports = CartManager