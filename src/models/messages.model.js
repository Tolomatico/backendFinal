const mongoose=require("mongoose")

const messagesSchema=new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})

const messagesModel= mongoose.model("messages",messagesSchema)
module.exports=messagesModel