const mongoose=require("mongoose")
const cartsCollection= "carts"

const cartsSchema= new mongoose.Schema({
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products",
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }

        }
    ]
})

const cartsModel=mongoose.model(cartsCollection,cartsSchema)

module.exports=cartsModel