const mongoose = require('mongoose');

// create a Schema
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        user_mail: {
            type: String,
            required: true,
        },
        Menu_item: {
            type: Array,
            required: true,
        },
        Total_Amount: {
            type: Number,
            required: true
        },
        Contact: {
            type: Number,
            reuired: true
        },
        Address: {
            type: String,
            required: true
        }
    }
);

// export the model
module.exports = mongoose.model('order', OrderSchema, 'orders');