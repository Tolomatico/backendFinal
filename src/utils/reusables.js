const response=(res,status,message)=>{
   return res.status(status).json({message})
}

const verifyEmail=(email)=>{
   const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   return validEmail.test(email)
}

module.exports={response,verifyEmail}