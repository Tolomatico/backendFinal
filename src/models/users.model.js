const mongoose=require("mongoose")
const usersCollection="users"

const usersSchema= new mongoose.Schema({
    first_name:{
        type:String
    },
    last_name:{
        type:String,
        
    },
    email:{
        type:String,
        unique:true,
        index:true
    },
    password:{
        type:String,
       
    },
    age:{
        type:Number
        
    },
    rol:{
        type:String,
        enum:['admin', 'user','premium'],
        default:"user"

    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"cart"

    },
    accountId:{
        type:String,
    },
    provider:{
        type:String
    },
    token:{
        type:String
    }

})

const usersModel= mongoose.model(usersCollection,usersSchema)

module.exports=usersModel