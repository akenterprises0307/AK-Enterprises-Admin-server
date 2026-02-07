import { v2 as cloudinary } from 'cloudinary'

const connectCd = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API,
            api_secret: process.env.CLOUDINARY_SECRET,
        })
        console.log('Cloudinary connected')
    } catch (error) {
        console.log(`Cloudinary connection error: ${error.message}`)
    }
}

export default connectCd