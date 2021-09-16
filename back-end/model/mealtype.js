const mongoose = require('mongoose')



const Schema = mongoose.Schema;

const Mealtype = new Schema(
    {
        name : {
            type : String,
            required : true
        },
        content : {
            type : String,
            required : true
        }
    }
);


module.exports = mongoose.model('mealtype',Mealtype,'mealtype')