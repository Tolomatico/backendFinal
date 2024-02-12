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

            if (!cart) {
                console.log("No esxiste un carrito con ese id")
                return null
            }

            const cartProductExisting = cart.products.find(item => item.product == pid)
            if (cartProductExisting) {
                cartProductExisting.quantity += quantity
            } else {
                cart.products.push({ product: pid, quantity })
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


    async deleteCart(cid) {
        try {
            const carts = await cartsModel.findByIdAndDelete(cid)
            if (!carts) {
                console.log("No se encontro el carrito")
                return null
            }
            console.log("Carrito eliminado con éxito")

        } catch (error) {
            console.log("Error al eliminar el carrito", error)
        }
    }

    async deleteProductFromCart(cid, pid) {

        try {

            const cart = await cartsModel.findById(cid)
            if (!cart) {
                console.log("No se encuentra el carrito buscado")
                return null
            }

            const index = cart.products.findIndex(item => item.product == pid)
            if (index !== -1) {

                cart.products.splice(index, 1)

                cart.markModified("products")
                await cart.save()
                console.log("Producto eliminado del carrito correctamente")
            }
            return null

        } catch (error) {
            console.log("Error al intentar borrar el producto", error)
        }
    }

    async updateProductsFromCart(cid,products){

        try {
            const cart = await cartsModel.findByIdAndUpdate(
                cid,{$push : { products : {$each: products}}}, { new: true })
                
            if (!cart) {
                console.log("No se encuentra el carrito buscado")
                return null
            }
          
            return cart

        } catch (error) {
            console.log("Error al querer encontrar el carrito", error)
        }


    }

    async updateCartProduct(cid, pid, quantity) {

        try {
            const cart = await cartsModel.findById(cid)
            if (!cart) {
                console.log("No se encuentra el carrito buscado")
                return null
            }
            
            const index = cart.products.findIndex(item => item.product == pid)

            if (index !== -1) {

                cart.products[index].quantity = quantity
                cart.save()
                console.log("Cantidad modificada")
            } else {
                console.log("No existe un producto con ese id en el carrito")
            }


        } catch (error) {
            console.log("No se encontro el producto a modificar", error)
        }


    }



}

module.exports = CartManager