const mongoose=require("mongoose")
const usersCollection="users"

const usersSchema= new mongoose.Schema({
    first_name:{
        type:String,
        required:true
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
        required:true,
    },
    age:{
        type:Number,
        required:true
    },
    rol:{
        type:String,
        default:"user"

    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"carts"

    },
    accountId:{
        type:String,
    },
    provider:{
        type:String
    }

})

const usersModel= mongoose.model(usersCollection,usersSchema)

module.exports=usersModel