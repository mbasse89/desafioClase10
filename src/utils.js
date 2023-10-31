import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const PORT = process.env.PORT || 8080
export default __dirname

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, './src/public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const uploader = multer({storage})

