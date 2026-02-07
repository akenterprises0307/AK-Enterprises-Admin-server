import express from 'express'
import Order from '../models/orderSchema.js'
import { generateOrderPdf } from '../utils/pdfService.js'
import { sendOrderEmail } from '../utils/emailService.js'

const router = express.Router()

// Create a new order
router.post('/create', async (req, res) => {
    const { customer_name, company, location, phone, email, items } = req.body

    if (!customer_name || !phone || !email) {
        return res.status(400).json({
            error: 'Missing required fields: customer_name, phone, and email are required'
        })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            error: 'Order must contain at least one item'
        })
    }
    
    for (const item of items) {
        if (!item.product_id || !item.product_name || !item.quantity) {
            return res.status(400).json({
                error: 'Each item must have product_id, product_name, and quantity'
            })
        }
        if (item.quantity < 1) {
            return res.status(400).json({
                error: 'Item quantity must be at least 1'
            })
        }
    }

    try {
        const order = await Order.create({
            customer_name,
            company: company || '',
            location: location || '',
            phone,
            email,
            items: items.map(item => ({
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                image: item.image || '',
                brand: item.brand || ''
            }))
        })

        let emailStatus = 'skipped'
        try {
            const orderData = order.toObject()
            const pdfBuffer = await generateOrderPdf(orderData)
            await sendOrderEmail(orderData, pdfBuffer)
            emailStatus = 'sent'
        } catch (mailError) {
            emailStatus = 'failed'
            console.error('Failed to send request copy email:', mailError)
        }

        res.status(201).json({
            message: 'Order created successfully',
            order_id: order._id,
            order,
            email_status: emailStatus
        })
    } catch (err) {
        console.error('Error in POST /create - Order creation:', err.message)
        res.status(500).json({
            error: 'Failed to create order. Please try again later.'
        })
    }
})

// Get all orders
router.get('/', async (_req, res) => {
    try {
        const orders = await Order.find().sort({ created_at: -1 })
        res.json({ orders })
    } catch (err) {
        console.error('Error in GET / - Fetch all orders:', err.message)
        res.status(500).json({ error: 'Failed to fetch orders. Please try again later.' })
    }
})

// Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }
        res.json({ order })
    } catch (err) {
        console.error('Error in GET /:id - Fetch single order:', err.message)
        res.status(500).json({ error: 'Failed to fetch order. Please try again later.' })
    }
})

// Update order status
router.put('/:id/status', async (req, res) => {
    const { status } = req.body
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled']

    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            error: `Status must be one of: ${validStatuses.join(', ')}`
        })
    }

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )

        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }

        res.json({
            message: 'Order status updated successfully',
            order
        })
    } catch (err) {
        console.error('Error in PUT /:id/status - Update order status:', err.message)
        res.status(500).json({
            error: 'Failed to update order status. Please try again later.'
        })
    }
})

export default router

