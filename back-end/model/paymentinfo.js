const mongoose = require('mongoose');

// create a Schema
const Schema = mongoose.Schema;

const PaymentinfoSchema = new Schema(
    {
        TXNID: {
            type: String,
            required: true,
        },
        ORDERID: {
            type: String,
            required: true,
        },
        TXNAMOUNT: {
            type: String,
            required: true,
        },
        STATUS: {
            type: String,
            required: true,
        }
    }
);

// export the model
module.exports = mongoose.model('paymentinfo', PaymentinfoSchema, 'paymentinfo');