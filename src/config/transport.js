const nodemailer=require("nodemailer")

const transport=nodemailer.createTransport({
    service:"gmail",
    port:587,
    auth:{
        user:"ballesty.t@gmail.com",
        pass:"poby wvxj fwpd arbk"
    }

})

module.exports=transport