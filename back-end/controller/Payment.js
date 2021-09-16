require('dotenv').config();
const formidable = require('formidable');
const https = require('https');
const { v4: uuidv4 } = require('uuid');

//MODULES
const orders = require('../model/order')
const payment_info = require('../model/paymentinfo')

// Need the external paytm library to authenticate the payments
const PaytmChecksum = require('./PaytmChecksum');



exports.payment = (req, res) => {
    const {
        amount,
        email,
        mobileNo,
        Orders
    } = req.body


    const orderObj = new orders(
        {
            user_mail: email,
            Menu_item: Orders,
            Total_Amount: amount,
            Contact: mobileNo,
            Address: "Address"
        }
    );

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

    //will use .env keys 
    let params = {};

    params['MID'] = process.env.PAYTM_MID;
    params['WEBSITE'] = process.env.PAYTM_WEBSITE;
    params['CHANNEL_ID'] = process.env.PAYTM_CHANNEL_ID;
    params['INDUSTRY_TYPE_ID'] = process.env.PAYTM_INDUSTRY_TYPE;
    params['ORDER_ID'] = uuidv4();
    params['CUST_ID'] = email;
    params['TXN_AMOUNT'] = amount.toString();
    params['EMAIL'] = email;
    params['MOBILE_NO'] = mobileNo.toString();
    params['CALLBACK_URL'] = 'https://gentle-wave-50371.herokuapp.com/paymentCallback';

    //use paytmchecksum to generate signature 
    let paytmCheckSum = PaytmChecksum.generateSignature(params, process.env.PAYTM_MERCHANT_KEY);

    paytmCheckSum.then(response => {
        let paytmCheckSumResponse = {
            ...params,
            "CHECKSUMHASH": response
        };
        // console.log(paytmCheckSumResponse)
        res.json(paytmCheckSumResponse);
    }).catch(error => {
        res.status(500).json({
            message: "Error in Payment",
            error: error
        });
    });

}

exports.paymentCallback = (req, res) => {
    //called by paytm server paytm server will send the transaction info
    // need to read this transaction info

    const form = new formidable.IncomingForm();


    form.parse(req, (error, fields, file) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error })
        }
        const checkSumHash = fields.CHECKSUMHASH;
        // console.log(fields.CHECKSUMHASH)
        delete fields.CHECKSUMHASH

        //verify the signature 

        const isVerified = PaytmChecksum.verifySignature(fields, process.env.PAYTM_MERCHANT_KEY, checkSumHash);
        if (isVerified) {
            // response is valid 

            var params = {};

            params['MID'] = fields.MID;
            params['ORDER_ID'] = fields.ORDERID;
            // params['CUST_ID'] = fields.CUST_ID;

            PaytmChecksum.generateSignature(params, process.env.PAYTM_MERCHANT_KEY)
                .then(result => {
                    params["CHECKSUMHASH"] = result;
                    const data = JSON.stringify(params);

                    const options = {
                        hostname: "securegw-stage.paytm.in",
                        port: 443,
                        path: "/order/status",
                        method: "POST",
                        headers: {
                            'ContentType': 'applications/json',
                            'Content-length': data.length
                        },
                        data: data
                    }

                    let response = ""
                    let request = https.request(options, (responseFromPaytmServer) => {
                        responseFromPaytmServer.on('data', (chunk) => {
                            response += chunk;
                        });
                        responseFromPaytmServer.on('end', () => {
                            if (JSON.parse(response).STATUS == 'TXN_SUCCESS') {
                                //success
                                // res.send("success");
                                // res.sendFile(__dirname + '/success.html')
                                console.log(JSON.parse(response));
                                const userObj_payment = new payment_info(
                                    {
                                        TXNID: JSON.parse(response).TXNID,
                                        ORDERID: JSON.parse(response).ORDERID,
                                        TXNAMOUNT: JSON.parse(response).TXNAMOUNT,
                                        STATUS: JSON.parse(response).STATUS
                                    }
                                );
                                userObj_payment.save().then(result => {
                                    res.status(200).json({
                                        message: "paymentinformation is here",
                                        paymentinfo: result
                                    });
                                }).catch(error => {
                                    res.status(500).json({
                                        message: "Error in Database",
                                        error: error
                                    });
                                });

                                res.redirect('https://cheaf-master.herokuapp.com/Success')
                            } else {
                                // failure
                                // res.send("failre");
                                // res.sendFile(__dirname + '/failure.html')
                                res.redirect('https://cheaf-master.herokuapp.com/Failure')
                            }
                        });
                    })
                    request.write(data);
                    request.end()

                }).catch(error => {
                    res.status(500).json({
                        message: "Error in Payment",
                        error: error
                    });
                });

        } else {
            // response is not valid 
            console.log('checksum missmatch ')
            res.status(500).json({ error: 'its a hacker ...!' })
        }
    })
}