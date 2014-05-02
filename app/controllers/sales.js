//sales controller
var mongoose = require('mongoose'),
        Sales = require('../models/sales.js'),
        Customer = require('../models/Customer.js'),
        Inventory = require('../models/inventory.js');
var _ = require('underscore');




function doesCustomerExist(req, res) {
    var Cust_email = req.body.customerEmailFE,
            sales_PersId = req.session.uid;


    Customer.find({
        email: Cust_email
    }, function(err, doc) {

        //username does not exist, create it
        if (!doc.length) {
            console.log("Add New Customer Section " + Cust_email + " does not already exist");

            //customer does not exist create a new one
            res.jsonp({
                flag: "0"
            });
        } else {
            //username already exists, send it to Front-end
            res.jsonp(doc);
        }
    });

}

exports.addNewCustomer = function(req, res) {

    var sales_PersId = req.session.uid,
            cust_Id = req.body.customerIdFE,
            cust_fName = req.body.customerFirstNameFE,
            cust_lName = req.body.customerLastNameFE,
            cust_phNum = req.body.customerPhoneNumberFE,
            cust_email = req.body.customerEmailFE,
            cust_address = req.body.customerAddressFE;

    Customer.insert({
        customerId: cust_Id,
        firstName: cust_fName,
        lastName: cust_lName,
        phoneNumber: cust_phNum,
        email: cust_email,
        address: cust_address
    }, function(error, doc) {
        if (error) {
            throw error;
        } else {
            res.jsonp(doc);
        }

    });
};

exports.editCustomer = function(req, res) {

    var sales_PersId = req.session.uid,
            cust_Id = req.body.customerIdFE,
            cust_fName = req.body.customerFirstNameFE,
            cust_lName = req.body.customerLastNameFE,
            cust_phNum = req.body.customerPhoneNumberFE,
            cust_email = req.body.customerEmailFE,
            cust_address = req.body.customerAddressFE;

    if (salPersId === undefined) {
        return res.redirect("/login");
    }

    Customer.update({
        customerId: cust_Id,
        firstName: cust_fName,
        lastName: cust_lName,
        phoneNumber: cust_phNum,
        email: cust_email,
        address: cust_address
    }, function(error, doc) {
        if (error) {
            throw error;
        } else {
            res.jsonp(doc);
        }

    });
};

exports.searchCustomer = function(req, res) {
    var sales_PersId = req.session.uid;

    if (salPersId === undefined) {
        return res.redirect("/login");
    }

    doesCustomerExist(res, req)

};

exports.addToCart = function (req, res) {

var sales_PersId = req.session.uid,
        cust_Id = req.body.customerIdFE,
        product_comments = req.body.commentFE,
        total_Price = req.body.customerLastNameFE,
        product_upc = req.body.upcFE,
        product_name = req.body.nameFE,
        product_quantity = req.body.quantityFE,
        product_price = req.body.priceFE,
        sale_date = new Date();
        if (salPersId === undefined) {
return res.redirect("/login");
}


Sales.findOne({ salesPersonId: sales_PersId, customerId: cust_Id, state: 0},
        function (err, doc) {
        if (err) {

        throw err;
        }

        if (doc) {

        Sales.update({ salesPersonId: sales_PersId, customerId: cust_Id, state: 0}, {
        salesPersonId: sales_PersId,
                customerId: cust_Id,
                comments: product_comments,
                totalPrice: total_Price,
                date: sale_date,
                state: 0,
                $push: {product: {
        "upc": product_upc,
                "name": product_name,
                "quantity": product_quantity,
                "price": product_price}} }, function (error, doc) {

        if (error) {
        throw error;
        }


        });
        }
        else  {

        Sales.insert({
        salesPersonId: sales_PersId,
                customerId: cust_Id,
                comments: product_comments,
                totalPrice: total_Price,
                date: sale_date,
                state: 0,
                $push: {
        product: {
        "upc": product_upc,
                "name": product_name,
                "quantity": product_quantity,
                "price": product_price
        }
        }

        }, function (error, doc) {
        if (error) {
        throw error;
        }


        });
        }

        Inventory.update({
        upc: product_upc
        }, {
        $inc: {
        onHoldQu: product_quantity
        }
        }, function (error, doc) {

        if (error) {
        throw error;
        }


        });
        })};
exports.FinalizeInvoice = function (req, res) {
        var uid = req.session.uid,
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

                _.each(doc.product, function (result, key) {
                var decrease = - 1 * result.quantity;
                        //Here you are converting javascript object into JSON. 
                        //That is remove all the functions associated with "result" object.
                        Inventory.update({
                upc: result.upc
                }, {
                $inc: {
                onHandQu: decrease,
                        soldQu: result.quantity,
                        onHoldQu: decrease
                }
                })

                        //Note: Here submission.save() won't work.
                });
                        Sales.update({
                salesPersonId: sales_PersId,
                        customerId: cust_Id,
                        state: 0
                }), {
                state: 1
                }

                ,function (err, doc) {
                if (err) {

                throw err;
                }
                }
                }
                })
                };
                
                
                
exports.seachProduct = function (req, res) {
                var uid = req.session.uid;
                        if (uid === undefined)
                        return res.redirect("/login");
                        var user_creteria = req.body.creteriaFE;
                        //var 
                        Inventory.find({
                name: new RegExp('.*' + user_creteria + '.*', 'i')
                }, function (err, docs) {
                res.jsonp(doc);
                })
                };