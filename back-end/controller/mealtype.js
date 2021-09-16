
const mealtypeMD = require('../model/mealtype')

exports.getmealtype = (req ,res)=>{
    mealtypeMD.find().then(result=>{
        res.status(200).json({
                message :"Here is your Mealtype",
                mealtype : result
        });
    }).catch(error=> {
        res.status(500).json({
                message : "cant connect to DB",
                error:error
        })
    });
}