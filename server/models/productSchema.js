import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    product_name : {type:String, required:true},
    short_description : {type:String, required:true},
    long_description : {type:String, required:true},
    image : {type:String, required:true},
    brand : {type:String, required:true},
    category : {type:[String], required:true},
    tags : {type:[String], default:[]},
    features : {type:[String], default: []},
    specifications : {type:mongoose.Schema.Types.Mixed, required:true}
})

const product = mongoose.model('product', productSchema);

export default product