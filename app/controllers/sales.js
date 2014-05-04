//sales controller
var mongoose = require('mongoose'),
    Sales = require('../models/sales.js'),
    Customer = require('../models/customer.js'),
    Inventory = require('../models/inventory.js');
var _ = require('underscore');


//searching the customer criteria are first name, last name  and customer id 
//input : customerNameFE

function doesCustomerExist(req, res) {
    var Cust_email = req.body.name,
        sales_PersId = req.session.uid;
    console.log(Cust_email);
   



    /*Customer.find({}, function (err, result) {
        console.dir(result);
    });*/

    Customer.find({ $or: [{
        firstName: new RegExp(Cust_email, 'i')} , {lastName: new RegExp(Cust_email, 'i')}
        ,{email: new RegExp(Cust_email, 'i')}]
    }, function (err, doc) {
        if (err) {
            throw err
        };

        //the customer does not exist, 
        console.log(doc.length);
        console.dir(doc);
        if (!doc.length) {
            console.log("Add New Customer Section " + Cust_email + " does not already exist");

            //customer does not exist tell the front end to create a new one
            res.jsonp({
                message: "customer does not exist"

            });
        } else {

            //customer exists, send it to Front-end
            console.log("found")
            res.jsonp(doc);
        }
    });

}

// Adding a new customer and send back the successful object message to the client.
// Server is sure that client side already searched this customer and knows there isn't any in DB
// inputs: customerLastNameFE, customerFirstNameFE,[customerLastNameFE], [customerPhoneNumberFE],
// [customerEmailFE],[customerAddressFE] 

exports.addNewCustomer = function (req, res) {

    var sales_PersId = req.session.uid,
        cust_Id = 2,
        cust_fName = req.body.first,
        cust_lName = req.body.last,
        cust_phNum = req.body.phone,
        cust_email = req.body.email,
        cust_address = req.body.address;
    var docs = {
        customerId: cust_Id,
        firstName: cust_fName,
        lastName: cust_lName,
        phoneNumber: cust_phNum,
        email: cust_email,
        address: cust_address
    };


    var temp = new Customer(docs);
    temp.save(function (err, admin) {
        if (err) return console.error(err);
        else {
            res.jsonp({
                message: " The Customer information was succesfuly saved."
            });
        }
    });


};

 // Editting the exsiting customer (***** customer id is not changable *** ) and then send back 
 // a succesful object message. 
 // inputs: customerIdFE, customerFirstNameFE,[customerFirstNameFE], [customerPhoneNumberFE],
 // [customerEmailFE],[customerAddressFE] 

exports.editCustomer = function (req, res) {

    var sales_PersId = req.body.sales_PersId,
        // var sales_PersId = req.session.uid,
        cust_Id = req.body.customerIdFE,
        cust_fName = req.body.customerFirstNameFE,
        cust_lName = req.body.customerLastNameFE,
        cust_phNum = req.body.customerPhoneNumberFE,
        cust_email = req.body.customerEmailFE,
        cust_address = req.body.customerAddressFE;

    if (sales_PersId === undefined) {
        return res.redirect("/login");
    }

    Customer.update({
        customerId: cust_Id},{
        firstName: cust_fName,
        lastName: cust_lName,
        phoneNumber: cust_phNum,
        email: cust_email,
        address: cust_address
    }, function (error, doc) {
        if (error) {
           
            throw error;
        } else {

            res.jsonp({
                message: "Customer information was succesfuly edited "
            });
        }

    });
};


// Searching customer by calling the doesCustomerExist function 

exports.searchCustomer = function (req, res) {
    var sales_PersId = req.session.uid;

    if (sales_PersId === undefined) {
        return res.redirect("/login");
    }


    console.log("Here searchCustomer");
    doesCustomerExist(req, res);

};


// Adding to cart  :   First search if the cart for this customer and this sale person already
// exists then update stuff into that otherwise create a new cart . aside from that update the inventory
// collections (o)  
// inputs : customerIdFE, commentFE, totalPriceFE , upcFE, productNameFE, quantityFE,priceFE
exports.addToCart = function (req, res) {

     
    var sales_PersId = req.session.uid,
        cust_Id = req.body.customerIdFE,
        product_comments = req.body.commentFE,
        total_Price = req.body.totalPriceFE,
        product_upc = req.body.upcFE,
        product_name = req.body.productNameFE,
        product_quantity = req.body.quantityFE,
        product_price = req.body.priceFE,
        sale_date = new Date();

    if (sales_PersId === undefined) {
        return res.redirect("/login");
    }


    Sales.findOne({
            salesPersonId: sales_PersId,
            customerId: cust_Id,
            state: 0
        },
        function (err, doc) {
            if (err) {

                throw err;
            }

            if (doc) {

                Sales.update({
                    salesPersonId: sales_PersId,
                    customerId: cust_Id,
                    state: 0
                }, {
                    salesPersonId: sales_PersId,
                    customerId: cust_Id,
                    comments: product_comments,
                    totalPrice: total_Price,
                    date: sale_date,
                    state: 0,
                    $push: {
                        products: {
                            "upc": product_upc,
                            "name": product_name,
                            "quantity": product_quantity,
                            "price": product_price
                        }
                    }
                }, function (error, doc) {

                    if (error) {
                        throw error;
                    } else {
                        Inventory.update({
                            upc: product_upc
                        }, {
                            $inc: {
                                onHoldQu: product_quantity
                            }
                        }, function (error, doc) {

                            if (error) {
                                throw error;
                            } else {
                                console.log("updated to inventory");
                                res.jsonp({
                                    message: "The new order has beeen updated into the inventoryDB & inserted to the cart "
                                });
                            }


                        });
                    }


                });



            } else {

                console.log({
                    "upc": product_upc,
                    "name": product_name,
                    "quantity": product_quantity,
                    "price": product_price
                });

                var docs = {
                    salesPersonId: sales_PersId,
                    customerId: cust_Id,
                    comments: product_comments,
                    totalPrice: total_Price,
                    date: sale_date,
                    state: 0,

                    products: [{
                        'upc': product_upc,
                        'name': product_name,
                        'quantity': product_quantity,
                        'price': product_price

                    }]
                };


                var temp = new Sales(docs);
                temp.save(function (err, admin) {
                    if (err) {
                        return console.error(err);
                    } else {
                        console.log('message : The new order has beeen added into the cart');
                    }


                });

                Inventory.update({
                    upc: product_upc
                }, {
                    $inc: {
                        onHoldQu: product_quantity
                    }
                }, function (error, doc) {

                    if (error) {
                        throw error;
                    } else {
                        console.log("updated to inventory");
                        res.jsonp({
                            message: "The new order has beeen updated into the inventoryDB & inserted to the cart "
                        });
                    }


                });



            }

        })
};

// --Finalizing the opend cart and update the inventory and sale DB.
// -- input :   sales_PersId,customerIdFE,commentFE, customerLastNameFE,upcFE, nameFE,quantityFE,priceFE
exports.FinalizeInvoice = function (req, res) {
    var uid = req.session.uid;
    var sales_PersId = req.body.sales_PersId,
        cust_Id = req.body.customerIdFE,
        product_comments = req.body.commentFE,
        total_Price = req.body.customerLastNameFE,
        product_upc = req.body.upcFE,
        product_name = req.body.nameFE,
        product_quantity = req.body.quantityFE,
        product_price = req.body.priceFE,
        sale_date = new Date();

    if (uid === undefined)
    return res.redirect("/login");

    Sales.findOne({
            salesPersonId: sales_PersId,
            customerId: cust_Id,
            state: 0
        },
        function (err, doc) {
            if (err) {

                throw err;
            }



            if (doc) {
                console.log("found one in salesDB");
                console.dir(doc);

                //------------------------------------
                Sales.update({
                        salesPersonId: sales_PersId,
                        customerId: cust_Id,
                        state: 0
                    }, {
                        state: 1
                    }

                    , function (err, doc) {
                        if (err) {

                            throw err;
                        }
                        console.log("update the salesDB State = 1");
                    });
                //-----------------------------------

                _.each(doc.products, function (result, key) {
                    console.log("inside the loop");
                    console.dir(result);

                    var decrease = -1 * result.quantity;
                    
                    Inventory.update({
                        upc: result.upc
                    }, {
                        $inc: {
                            onHandQu: decrease,
                            soldQu: result.quantity,
                            onHoldQu: decrease
                        }
                    }, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("update the InventoryDB ");
                        }

                    })

                    console.log("inventory fuck");


                });

                //--------------------------------------------

                //-----------------------------------------------
            }
        })
};



// exports.seachProduct = function (req, res) {
//     var uid = req.session.uid;
//     if (uid === undefined)
//         return res.redirect("/login");
//     var user_creteria = req.body.creteriaFE;
//     //var 
//     Inventory.find({
//         name: new RegExp(user_creteria, 'i')
//     }, function (err, docs) {
//         res.jsonp(doc);
//     })
// };