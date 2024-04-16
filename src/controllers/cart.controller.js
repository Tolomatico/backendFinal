const response = require("../utils/reusables.js")
const CartManager = require("../dao/db/cart-manager-db.js")
const { create } = require("../models/ticket.model")
const ticketModel = require("../models/ticket.model")
const { generateCode } = require("../utils/equations")
const usersModel = require("../models/users.model.js")
const cartManager = new CartManager()

class CartController {

    async finishPurchase(req, res) {
        const cartId = req.params.cid


        try {

            const cart = await cartManager.getCartById(cartId)
            const products = cart.products
            const user = await usersModel.findOne({ cart: cartId })

            const amount=products.reduce((acc,item)=>{
                return acc + (item.product.price * item.quantity)
            },0)

              const ticket=new ticketModel({
                  code:generateCode(),
                  purchase_datetime:Date.now(),
                  amount:amount,
                 purchaser:user._id
              })

              await ticket.save()
            response(res, 201, `Se ah generado el ticket correctamente`)

        } catch (error) {
            response(res, 404, `Error al generar el ticket: ${error}`)
        }






    }


}

module.exports = CartController