const response = require("../utils/reusables.js")
const CartManager=require("../dao/db/cart-manager-db.js")
const { create } = require("../models/ticket.model")
const ticketModel = require("../models/ticket.model")
const totalCart = require("../utils/equations")
const usersModel = require("../models/users.model.js")
const cartManager=new CartManager()

class CartController{

    async finishPurchase(req,res){
       const cartId=req.params.cid
      
       
       try {

            const cart= await cartManager.getCartById(cartId)
           
            const user=await usersModel.findOne({cart:cartId})
           
           

             const ticket=new ticketModel({
                 code:1,
                 purchase_datetime:Date.now(),
                 amount:50,
                 purchaser:user._id
             })
            
             await ticket.save()
             response(res,201,`Se ah generado el ticket correctamente`)
            
       } catch (error) {
        response(res,404,`Error al generar el ticket: ${error}`)
       }

      
       
    


    }


}

module.exports=CartController