const express = require('express')

const router = express.Router();

// import the controller

    //controller for location
    const loccontroller=require('../controller/location')

    //controller for Allrestaurant
    const Allrestaurant=require('../controller/restaurant')

    //controller for mealtype
    const mealtypecon=require('../controller/mealtype')

    //controller for user
    const usercon=require('../controller/user')

    //controller for Menu
    const menucon = require('../controller/menu')

    //controller for order
    const ordercon = require('../controller/order')

    //controller for payment
    const Paytmpaymentcon = require('../controller/Payment')

// have routes


//restaurant routes
router.get('/allrestaurant', Allrestaurant.getallrestaurant)

router.get('/restaurant/:id', Allrestaurant.getrestaurantById)

router.get('/getrestaurantbycity/:city', Allrestaurant.getrestaurantByCity)


//restaurant filter 
router.post('/filterRestaurants',Allrestaurant.filterrestaurant)






//location routes
router.get('/getalllocation',loccontroller.getLocation)

router.get('/getlocation/:city',loccontroller.getLocationByCity)


//mealtype routes
router.get('/getmealtype',mealtypecon.getmealtype)


//User login and Signup

router.post('/getusersign',usercon.signUp)
router.post('/userlogin',usercon.login)


//order details

router.post('/saveorders',ordercon.orderlist)
router.get('/getuserorders/:mail', ordercon.getorderlist)


//menu
router.get('/getmenu/:id',menucon.menudetails)



//paymeny API

router.post('/payment',Paytmpaymentcon.payment)

router.post('/paymentcallback',Paytmpaymentcon.paymentCallback)

//payment info


//exporting 
module.exports = router;





