//import models

const location = require('../model/location')


//functionalities

exports.getLocation = (req ,res) => {
    location.find().then(result => {
        res.status(200).json({
            message : "Location Fetch",
            locations : result
        });
    }).catch(error => {
        res.status(500).json({
            message : "error in DB",
            error : error
        });
    });
}


exports.getLocationByCity = (req,res)=>{
    const Rcity = req.params.city;
    location.find({ city : Rcity}).then(result =>{
        res.status(200).json({
            message : `here is your Restaurant ${Rcity}`,
            restaurant : result
        });
    }).catch(error => {
        res.status(500).json(
            {
                message: "error in Database",
                error: error
            }
        );
    });
}