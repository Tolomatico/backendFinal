const mongoose=require("mongoose")
const configObject=require("./config/config.js")
const {mongo_url}=configObject

class BaseDeDatos{
   static #instance;

     constructor(){

        mongoose.connect(mongo_url)
     }

     static getInstance(){
        if(this.#instance){
            console.log("Conectado previamente.")
            return this.#instance
        }
        else {
            this.#instance=new BaseDeDatos()
            console.log("Conectado a la base de datos.")
            return this.#instance
        }
     }

}

module.exports=BaseDeDatos.getInstance()
