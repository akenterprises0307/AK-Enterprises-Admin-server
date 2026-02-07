import express from 'express'
import upload from '../config/multer.js'
import { v2 as cloudinary } from 'cloudinary'
import Product from '../models/productSchema.js'
import { parseArrayField, parseObjectField } from '../utils/parse.js'

const router = express.Router()

// create a new product route
router.post('/create', upload.single('image'), async (req, res) => {
    const image = req.file
    const {
        product_name,
        short_description,
        long_description,
        brand,
        category,
        tags,
        features,
        specifications,
    } = req.body

    const requiredFields = [
        'product_name',
        'short_description',
        'long_description',
        'brand',
        'category',
        'specifications',
    ]

    const missingField = requiredFields.find((field) => !req.body[field])

    if (!image || missingField) {
        return res.status(400).json({
            error: missingField
                ? `Missing required field: ${missingField}`
                : 'Product image is required',
        })
    }

    let parsedCategory
    let parsedFeatures
    let parsedTags
    let parsedSpecifications

    try {
        parsedCategory = parseArrayField(category, 'category', { required: true })
        parsedFeatures = parseArrayField(features, 'features') || []
        parsedTags = parseArrayField(tags, 'tags') || []
        parsedSpecifications = parseObjectField(specifications, 'specifications', { required: true })
    } catch (validationError) {
        console.error('Error in POST /create - Field validation:', validationError.message)
        return res.status(400).json({ error: 'Invalid data format. Please check your input fields.' })
    }

    try {

        const { secure_url } = await cloudinary.uploader.upload(image.path)

        const product = await Product.create({
            product_name,
            short_description,
            long_description,
            brand,
            image: secure_url,
            category: parsedCategory,
            tags: parsedTags,
            features: parsedFeatures,
            specifications: parsedSpecifications,
        })
        res.status(201).json({ message: 'Product created successfully', product_id: product._id })

    } catch (err) {
        console.error('Error in POST /create - Product creation:', err.message)
        res.status(500).json({
            error: 'Failed to create product. Please try again later.',
        })
    }
})

// get all products
router.get('/', async (_req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 })
        res.json({ products })
    } catch (err) {
        console.error('Error in GET / - Fetch all products:', err.message)
        res.status(500).json({ error: 'Failed to fetch products. Please try again later.' })
    }
})

// get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }
        res.json({ product })
    } catch (err) {
        console.error('Error in GET /:id - Fetch single product:', err.message)
        res.status(500).json({ error: 'Failed to fetch product. Please try again later.' })
    }
})

// update product
router.put('/:id', upload.single('image'), async (req, res) => {
    const image = req.file
    const updates = { ...req.body }

    try {
        if (updates.category !== undefined) {
            updates.category = parseArrayField(updates.category, 'category')
        }

        if (updates.features !== undefined) {
            updates.features = parseArrayField(updates.features, 'features')
        }

        if (updates.tags !== undefined) {
            updates.tags = parseArrayField(updates.tags, 'tags') || []
        }

        if (updates.specifications !== undefined) {
            updates.specifications = parseObjectField(updates.specifications, 'specifications')
        }
    } catch (validationError) {
        console.error('Error in PUT /:id - Field validation:', validationError.message)
        return res.status(400).json({ error: 'Invalid data format. Please check your input fields.' })
    }

    try {
        if (image) {
            const { secure_url } = await cloudinary.uploader.upload(image.path)
            updates.image = secure_url
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        })

        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }

        res.json({ message: 'Product updated successfully', product })
    } catch (err) {
        console.error('Error in PUT /:id - Update product:', err.message)
        res.status(500).json({ error: 'Failed to update product. Please try again later.' })
    }
})

// delete product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }

        res.json({ message: 'Product deleted successfully' })
    } catch (err) {
        console.error('Error in DELETE /:id - Delete product:', err.message)
        res.status(500).json({ error: 'Failed to delete product. Please try again later.' })
    }
})

export default router