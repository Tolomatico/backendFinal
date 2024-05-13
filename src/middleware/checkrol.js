const jwt=require("jsonwebtoken")
const configObject=require("../config/config.js")
const {response} = require("../utils/reusables")
const {secretKey}=configObject


const checkrole=(allowedRols)=>(req,res,next)=>{
    const token=req.cookies.cookieToken

    if(token){
        
        jwt.verify(token,secretKey,(err,decoded)=>{
            if(err){
                response(res,403,"Acceso denegado.Error al decodificar el token.")
            }else{
                const rol=decoded.user.rol
                if(allowedRols.includes(rol)){
                    next()
                }else{
                    response(res,403,"Acceso denegado.No tiene permiso para ingresar a este sitio.")
                }
            }
        })

    }else{
        response(res,403,"Acceso denegado.No se a proporcionado ningun token.")
    }


}

module.exports=checkrole