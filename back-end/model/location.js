//importing mongoose

const mongoose = require('mongoose')



//create a schema

const Schema = mongoose.Schema;

const LocationSchema = new Schema(
    {
        name : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        },
        city_id : {
            type : Number,
            required : true
        },
        location_id : {
            type : Number,
            required : true
        },
        country_name : {
            type : String,
            required : true
        },
    }
);



//export the model

module.exports = mongoose.model('location', LocationSchema, 'location')



