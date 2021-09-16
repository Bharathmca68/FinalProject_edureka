//import module

const menumd=require('../model/menu')

//geting RestaurantMenu by ID

exports.menudetails = (req ,res)=>{
    const Restid = req.params.id;
    menumd.find({restaurantId: Restid }).then(result => {
        res.status(200).json({
            message : `here is your Restaurant Menu ${Restid}`,
            menu : result
        });
    }).catch(error => {
        res.status(500).json(
            {
                message: "error in Database",
                error:error
            }
        );
    });
}