const multer = require("multer")
const configuracionMulter = {
    storage: fileStorage = multer.diskStorage(
        {
            destination: (req, file, cb) => {
                cb(null,__dirname + ('../../public/img'))
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`)
            }
        }
    )
}


const upload = multer(configuracionMulter).single("thumbnail")

module.exports = upload