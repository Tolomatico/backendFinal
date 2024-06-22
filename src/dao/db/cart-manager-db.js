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
                console.log("No existe un carrito con ese id")
                return null
            }


            const cartProductExisting = cart.products.find(item => item.product._id.toString() === pid)


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
            const carts = await cartsModel.find().populate({
                path: "products.product",
                model: "products"
            })
            if (!carts) {
                console.log("Error al recibir los carritos")
                return null
            }
            return carts

        } catch (error) {
        }
    }

    async emptyCart(cid) {

        try {
            const cart = await cartsModel.findByIdAndUpdate(cid)
            if (!cart) {
                console.log("No se encontro el carrito")
                return null
            }
            if (cart.products.length === 0) {

                return console.log("El carrito ya se encuentra vacio")
            }

            cart.products = []
            await cart.save()


            console.log("Carrito vaciado con éxito")

        } catch (error) {
            console.log("Error al evaciar el carrito", error)
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

            cart.products = cart.products.filter(item => item.product._id.toString() !== pid)

            await cart.save()
            return cart



        } catch (error) {
            console.log("Error al intentar borrar el producto", error)
        }
    }

    async updateProductsFromCart(cid, products) {

        try {
            const cart = await cartsModel.findByIdAndUpdate(
                cid, { $push: { products: { $each: products } } }, { new: true })

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
            const cart = await cartsModel.findById(cid);
            if (!cart) {
                console.log("No se encuentra el carrito buscado");
                return null;
            }

            const index = cart.products.findIndex(item => item.product._id == pid);
            if (index === -1) {
                console.log("No existe un producto con ese id en el carrito");
                return null;
            }

            const product = cart.products[index];



            if (quantity === 1 && product.quantity < 6) {

                product.quantity++
                await cart.save();
                return cart;
            }

            if (quantity === -1 && product.quantity === 1) {
                console.log("Cantidad mínima de un producto");
                return null;
            } else if (quantity === -1) {
                product.quantity--;
            } 

            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al modificar el producto en el carrito", error);
            return null;
        }
    }

}

module.exports = CartManager