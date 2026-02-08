import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import connectCd from './config/cloudinary.js'
import productsRoutes from './routes/productsRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config()

const app = express()

await connectDB()
await connectCd()


//middleware
app.use(cors({
  origin: 'https://ak-enterprises-app.vercel.app',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/products', productsRoutes)
app.use('/orders', orderRoutes)








const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})