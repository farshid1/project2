//sales controller
var mongoose = require('mongoose'),
    Sales = require('../models/sales.js'),
    Customer = require('../models/customer.js'),
    Inventory = require('../models/inventory.js');
var _ = require('underscore');


//searching the customer criteria are first name, last name  and customer id 
//input : customerName
function doesCustomerExist(req, res) {
    var Cust_email = req.body.customerName,
        sales_PersId = req.session.uid;

    /*Customer.find({}, function (err, result) {
        console.dir(result);
    });*/

    Customer.find({
        $or: [{
            firstName: new RegExp(Cust_email, 'i')
        }, {
            lastName: new RegExp(Cust_email, 'i')
        }, {
            email: new RegExp(Cust_email, 'i')
        }]
    }, function (err, doc) {
        if (err) {
            res.jsonp({
                message: "ERROR: on checking for customer existance"
            })
        };

        //the customer does not exist, 
        //console.dir(doc);
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
        //cust_Id = req.body.customerIdFE,
        cust_fName = req.body.first,
        cust_lName = req.body.last,
        cust_phNum = req.body.phone,
        cust_email = req.body.email,
        cust_address = req.body.address;

    var docs = {
        firstName: cust_fName,
        lastName: cust_lName,
        phoneNumber: cust_phNum,
        email: cust_email,
        address: cust_address
    };

    var temp = new Customer(docs);
    temp.save(function (err, admin) {
        if (err) return res.jsonp({
            message: "ERROR: on saving the new customer"
        });
        else {
            res.jsonp(admin);
        }
    });


};

// Editting the exsiting customer (***** customer id is not changable *** ) and then send back 
// a succesful object message. 
// inputs: customerIdFE, customerFirstNameFE,[customerFirstNameFE], [customerPhoneNumberFE],
// [customerEmailFE],[customerAddressFE] 
exports.editCustomer = function (req, res) {

    var sales_PersId = req.session.uid,
        cust_Id = req.body.customerId,
        cust_fName = req.body.customerFirstName,
        cust_lName = req.body.customerLastName,
        cust_phNum = req.body.customerPhoneNumber,
        cust_email = req.body.customerEmail,
        cust_address = req.body.customerAddress;

    //console.log(typeof (cust_Id) );
    if (sales_PersId === undefined) {
        return res.jsonp({
            message: "Authentication failed"
        });
    }

    Customer.update({
        _id: cust_Id
    }, {
        firstName: cust_fName,
        lastName: cust_lName,
        phoneNumber: cust_phNum,
        email: cust_email,
        address: cust_address
    }, function (error, doc) {
        if (error) {
            return res.jsonp({
                message: "ERROR: on updating the customer "
            });
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
        return res.jsonp({
            message: "Authentication failed"
        });
    }

    //console.log("searchCustomer");
    doesCustomerExist(req, res);

};


// Adding to cart  :   First search if the cart for this customer and this sale person already
// exists then update stuff into that otherwise create a new cart . aside from that update the inventory
// collections (o)  
// inputs : customerIdFE, commentFE, totalPriceFE , upcFE, productNameFE, quantityFE,priceFE
exports.addToCart = function (req, res) {


    var sales_PersId = req.session.uid,
        cust_Id = req.body.customerId,
        product_comments = req.body.comment,
        total_Price = req.body.totalPrice,
        product_upc = req.body.upc,
        product_name = req.body.productName,
        product_quantity = req.body.quantity,
        product_price = req.body.price,
        customer_name = req.body.customerName,
        sale_date = new Date();


    if (sales_PersId === undefined) {
        return res.jsonp({
            message: "couldn't find the sale person"
        });
    }


    Sales.findOne({
            salesPersonId: sales_PersId,
            customerId: cust_Id,
            state: 0
        },
        function (err, doc) {
            if (err) {
                return res.jsonp({
                    message: "ERROR: finding the sales person"
                });
            }

            if (doc) {

                Sales.update({
                    salesPersonId: sales_PersId,
                    customerId: cust_Id,
                    state: 0
                }, {
                    salesPersonId: sales_PersId,
                    customerName: customer_name,
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
                        return res.jsonp({
                            message: "ERROR: on updating the cart "
                        });
                    } else {
                        Inventory.update({
                            upc: product_upc
                        }, {
                            $inc: {
                                onHoldQu: product_quantity
                            }
                        }, function (error, doc) {

                            if (error) {
                                return res.jsonp({
                                    message: "ERROR: on updating the customer "
                                });
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
                    customerName: customer_name,
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
                        return res.jsonp({
                            message: "ERROR: on creating a new cart"
                        });
                    } else {
                        console.log('message : "The new order has beeen added into the cart');
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
                        //console.log("updated to inventory");
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
    var sales_PersId = req.session.uid;
        cust_Id = req.body.customerId,
        product_comments = req.body.comment,
        total_Price = req.body.totalPrice,
        product_upc = req.body.upc,
        product_name = req.body.name,
        product_quantity = req.body.quantity,
        product_price = req.body.price,
        sale_date = new Date();



    if (sales_PersId === undefined) {
        return res.jsonp({
            message: "Authentication failed"
        });
    }

    Sales.findOne({
            salesPersonId: sales_PersId,
            customerId: cust_Id,
            state: 0
        },
        function (err, doc) {
            if (err) {

                return res.jsonp({
                    message: "ERROR: on updating the customer "
                });
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

                            return res.jsonp({
                                message: "ERROR: on updating the customer "
                            });
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
                            quantity: decrease,
                            soldQu: result.quantity,
                            onHoldQu: decrease
                        }
                    }, function (err) {
                        if (err) {
                            return res.jsonp({
                                message: "ERROR: on updating the customer "
                            });
                        } else {
                            console.log("update the InventoryDB ");
                        }

                    })

                });

                //--------------------------------------------

                //-----------------------------------------------
            }
        })
    res.jsonp({
        message: "ERROR: on updating the customer "
    });
};

exports.showAllPendingCart = function (req, res) {
    console.log("jhasbdjhdsfbjhsdfjhsdfjhsdjhfbjsdhfbjshdfbjshd");
    var sales_PersId = req.session.uid;
    //cust_Id = req.body.customerId;
    if (sales_PersId === undefined) {
        //console.log("jhasbdjhdsfbjhsdfjhsdfjhsdjhfbjsdhfbjshdfbjshd");
        return res.redirect("/login");
    }

    Sales.find({
            salesPersonId: sales_PersId,
            state: 0
        },
        function (err, doc) {
            if (err) {

                res.jsonp({
                    message: "500 ,ServerError"
                });
            }

            if (doc) {
                res.jsonp(doc);
            } else {
                res.jsonp({
                    message: " No open Cart found"
                });
            }
        });
};


exports.editOrder = function (req, res) {
    //console.log("in edit");
    var sales_PersId = req.session.uid,
        cust_Id = req.body.customerId,
        product_comments = req.body.comment,
        total_Price = req.body.totalPrice,
        product_upc = req.body.upc,
        product_name = req.body.productName,
        product_quantity = req.body.quantity,
        product_price = req.body.price,
        customer_Name = req.body.customerName,
        sale_date = new Date();

        console.log("product quantity: ",product_quantity);

    Sales.findOne({
            salesPersonId: sales_PersId,
            customerId: cust_Id,
            state: 0
        },
        function (err, doc) {
            if (err) {
                console.log("in Errorr findone");
                throw err;
            }

            if (doc) {
                console.log("in foundone");

                Sales.update({
                    salesPersonId: sales_PersId,
                    customerId: cust_Id,
                    state: 0,
                    "products.upc": product_upc
                }, {
                    //????????????????
                    $inc: {
                        "products.$.quantity": product_quantity
                    }
                }, function (error, doc) {

                    if (error) {
                        console.log("in update Error");
                        throw error;
                    } else {
                        console.log("oooooooooook");

                        inventoryUpdate(req, res);
                    }


                });



            } else {

                res.jsonp({
                    message: 'could not find the item in the cart'
                });


            }

        })

};

// if closeOrder flag is '1' close the cart (last item deleted) otherwise 
// just remove the item form the cart
exports.deleteItem = function (req, res) {

    var sales_PersId = req.session.uid,
        cust_Id = req.body.customerId,
        product_comments = req.body.comment,
        total_Price = req.body.totalPrice,
        product_upc = req.body.upc,
        product_name = req.body.productName,
        product_quantity = req.body.quantity,
        product_price = req.body.price,
        customer_Name = req.body.customerName,
        last_itemOnCart = req.body.closeOrder,
        sale_date = new Date();


    console.log("sssssss" + last_itemOnCart);
    if (sales_PersId === undefined)
        return res.redirect("/login");

    if (last_itemOnCart === '1') {
        console.log("sssssss" + last_itemOnCart);



        Sales.update({
            salesPersonId: sales_PersId,
            customerId: cust_Id,
            state: 0
        }, {
            state: 1
        }, function (err, doc) {
            if (err) {

                throw err;
            } else {
                req.body.quantity = -1 * req.body.quantity;
                inventoryUpdate(req, res);
                res.jsonp({
                    message: "The last item in the cart was removed and cart was closed"
                });
            }


        });



    } else {
        console.log("elseeeeeee");
        Sales.update({
                salesPersonId: sales_PersId,
                customerId: cust_Id,
                state: 0
            }, {
                $pull: {
                    products: {
                        'upc': product_upc
                    }
                }
            },

            function (err, doc) {
                if (err) {

                    throw err;
                } else {
                    req.body.quantity = -1 * req.body.quantity;
                    inventoryUpdate(req, res);
                    res.jsonp({
                        message: "The item was removed from the cart"
                    })
                }
            });
    }

};



exports.reportInventory = function (req, res) {
    var uid = req.session.uid;
    if (uid === undefined)
        return res.redirect("/login");
    var user_creteria = req.body.creteria;
    //var 
    Inventory.find({
        name: new RegExp(user_creteria, 'i')
    }, function (err, docs) {
        res.jsonp(doc);
    })
};

function inventoryUpdate(req, res) {
    var sales_PersId = req.session.uid,
        cust_Id = req.body.customerId,
        product_comments = req.body.comment,
        total_Price = req.body.totalPrice,
        product_upc = req.body.upc,
        product_name = req.body.productName,
        product_quantity = req.body.quantity,
        product_price = req.body.price,
        customer_Name = req.body.customerName;

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
            return;
        }


    });
}


exports.getCustmoerInfoById = function (req, res) {
    var uid = req.session.uid,
        user_id = req.body.customerId;
    if (uid === undefined)
        return res.jsonp({
            message: "Authentication failed"
        });

    console.log(user_id);
    Customer.findOne({
        _id: user_id
    }, function (err, docs) {
        if (err) {
            res.jsonp({
                message: "ERROR: on finding the user"
            });
        }
        if (docs) {
            res.jsonp(docs);
        } else {
            console.dir(docs);
            res.jsonp({
                message: " The customer was not found by this id"
            });
        }

    });
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