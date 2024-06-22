const multer = require("multer")
const configurationMulter = {
    storage: fileStorage = multer.diskStorage(
        {
            destination: (req, file, cb) => {
                cb(null, __dirname + ('../../public/img'))
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`)
            }
        }
    )
}

const configurationMulterDocuments = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let destinationFolder;
            switch (file.fieldname) {
                case "profile":
                    destinationFolder = "./src/uploads/profiles";
                    break;
                case "products":
                    destinationFolder = "./src/uploads/products";
                    break;
                case "document":
                default:
                    destinationFolder = "./src/uploads/documents";
            }

            cb(null, destinationFolder)
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    })
}



const upload = multer(configurationMulter).single("thumbnail")
const uploads = multer(configurationMulterDocuments).fields([
    { name: "document" }, { name: "products" }, { name: "profile" }])


module.exports = {
    upload,
    uploads
}