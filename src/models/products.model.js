const mongoose=require("mongoose")
const productsCollection="products"

const productsSchema=new mongoose.Schema({
        
        title:{
                type:String,
                required:true
        } ,
        description:{
                type:String,
                required:true
        },
        price:{
                type:Number,
                required:true
        },img:{
                type:String
        },
        thumbnail:{
                type:[String],       
        },
        code:{
                type:String,
                required:true,
                unique:true
        },
        stock:{
                type:Number,
                required:true
        },
        status:{
                type:Boolean,
                required:true
        },
        category:{
                type:String,
                required:true
        }       
})

const productsModel=mongoose.model(productsCollection,productsSchema)

module.exports=productsModel
