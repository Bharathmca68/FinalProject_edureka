//import module

const restaurantmd=require('../model/restaurant')


//geting all Restaurant
exports.getallrestaurant = (req, res)=> {
    restaurantmd.find().then(result => {
        res.status(200).json({
            message : "here is your Restaurant",
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
};



//geting Restaurantby ID
exports.getrestaurantById = (req ,res)=>{
    const Restid = req.params.id;
    restaurantmd.find({ _id: Restid }).then(result => {
        res.status(200).json({
            message : `here is your Restaurant ${Restid}`,
            restaurant : result
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

//geting RestaurantbyCity
exports.getrestaurantByCity = (req ,res) => {
    const Rcity = req.params.city;
    restaurantmd.find({ city : Rcity}).then(result =>{
        res.status(200).json({
            message : `here is your Restaurant ${Rcity}`,
            restaurant : result
        });
    }).catch(error => {
        res.status(500).json(
            {
                message: "error in Database",
                error : error
            }
        );
    });
}

// exports.filterrestaurant = (req ,res)=> {

// }


exports.filterrestaurant = (req ,res)=> {
    const {
        mealType,
        location,
        cuisine,
        hcost,
        lcost,
        sort,
        page = 1
    } = req.body;

    let filters = {};

    // //logics    

    if(mealType){
        filters.mealtype_id = mealType
    }

    if(location){
        filters.location_id = location
    }

    if(cuisine && cuisine.length > 0 ){
        filters['cuisine.name'] = {
            $in : cuisine
        };
    }

    if(hcost !=undefined && lcost !=undefined){
        filters.min_price = {
            $gt : lcost,
            $lt : hcost   
        } 
    }
    
   

//sort({ min_price : sort })

    restaurantmd.find(filters).sort({ min_price: sort }).then(result =>{
        

        let page_size =2;
        
        let temp;

        function paginate(array, page_size, page_number) {

            return array.slice((page_number - 1) * page_size, page_number * page_size);
        }

        temp = paginate(result, page_size, page);



        res.status(200).json({
            message : `Number of Restaurant Found ${result.length} `,
            restaurant : temp,
            pageNO : page,
            pageSizeNo : page_size,
            totalRestaurantCount :  result.length

        });
    } ).catch(error => {
        res.status(500).json({
            message : "Error in Database",
            error : error
        });
    });
}
