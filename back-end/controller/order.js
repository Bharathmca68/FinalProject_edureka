const { response } = require('express');
const orders = require('../model/order')

exports.orderlist = (req ,res)=> {
    // const Reqbody = req.body
    const {
        user_mail,
        Menu_item,
        Total_Amount,
        Contact,
        Address
    } = req.body

    const orderObj  = new orders(
        {
            user_mail : user_mail,
            Menu_item : Menu_item,
            Total_Amount: Total_Amount,
            Contact: Contact,
            Address : Address
        }
    );
    
    //call the save method

    orderObj.save().then(result => {
        res.status(200).json({
            message: "order saved Successfully",
            order: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

exports.getorderlist = (req ,res)=>{
    const u_mail = req.params.mail;


    orders.find({ user_mail: u_mail }).then(result => {
        res.status(200).json({
            message : `here is order details of user ${u_mail}`,
            order_details : result
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