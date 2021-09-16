const { response } = require('express');
const User = require('../model/user')
const crypto = require('crypto')

exports.signUp = (req, res) => {
    // const Reqbody = req.body
    const {
        email,
        password,
        firstName,
        lastName
    } = req.body


    //ENCRYPTIONS OF PASSWORD
    const md5sum = crypto.createHash('md5');
    const resf = md5sum.update(password).digest('hex');
    console.log(resf);

    const userObj = new User(
        {
            email: email,
            password: resf,
            firstName: firstName,
            lastName: lastName
        }
    );


    // // FINDING THE EMAIL ALREADY EXIST R NOT 

    // User.find({
    //     email: email
    // }).then(result => {
    //     if (result.length > 0) {
    //         res.status(200).json({
    //             message: "USER ALREADY EXIST",
    //             user: result
    //         });
    //     } 
    // }).catch(error => {
    //     res.status(500).json({
    //         message: "error in Database",
    //         error: error
    //     })
    // });

    //call the save method TO SAVE THE USER IF NOT EXIST 

    userObj.save().then(result => {
        res.status(200).json({
            message: "User Registered Successfully",
            user: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

exports.login = (req, res) => {
    const {
        email: email,
        password: password
    } = req.body;


    //ENCRYPTIONS OF PASSWORD
    const md5sum = crypto.createHash('md5');
    const resf = md5sum.update(password).digest('hex');
    console.log(resf);

    User.find({
        email: email,
        password: resf
    }).then(result => {
        if (result.length > 0) {
            res.status(200).json({
                message: "logged in successfully",
                user: result
            });
        } else {
            res.status(404).json({
                message: "email r password is incorrect"
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "error in Database",
            error: error
        })
    });

}