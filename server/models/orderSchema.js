import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    customer_name: { type: String, required: true },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    items: [{
        product_id: { type: String, required: true },
        product_name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, default: '' },
        brand: { type: String, default: '' }
    }],
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    created_at: { type: Date, default: Date.now }
})

const Order = mongoose.model('Order', orderSchema)

export default Order
