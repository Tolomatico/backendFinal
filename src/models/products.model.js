const mongoose=require("mongoose")
const mongoosePaginate=require("mongoose-paginate-v2")
const productsCollection="products"

const productsSchema=new mongoose.Schema({
        
        title:{
                type:String,
                required:true,
                index:true
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
        },
        owner:{
                type:String,
                required:true,
                default:"admin"
        }    
})

productsSchema.plugin(mongoosePaginate)
const productsModel=mongoose.model(productsCollection,productsSchema)
module.exports=productsModel
