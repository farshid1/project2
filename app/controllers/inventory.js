//inventory controller
var mongoose = require('mongoose'),
    Inv = require('../models/inventory.js');

/*
upc: Number,
    name: String,
    picture: String,
    quantity: Number,
    onHoldQu: Number,
    soldQu: Number,
    price: Number,
    logs: [{
      inventoryPersonId: Number,
      date: Date,
      quantity: Number
    }]

*/

//if item exist increase the quantity by quantity else add the new item. 
//inputs: upcFE, quantityFE,[nameFE], [pictureFE], [priceFE] ,[onHoldQuFE:0], [soldFE:0]
exports.addQuantity = function (req, res) {
    var uid = req.session.uid;
    //console.log(uid);
    if (uid === undefined)
        return res.jsonp({
            message: "Authentication failed"
        });

    var upcU = req.body.upc;
    var quantityU = req.body.quantity;
    var dateU = new Date();
    var onHoldQuU = 0;
    var soldQuU = 0;




    if (req.body.onHoldQu)
        onHoldQuU = req.body.onHoldQu;
    if (req.body.sold)
        soldQuU = req.body.soldQu;


    //console.log("outside the find" + typeof (upcU));

    Inv.find({
        upc: upcU
    }).count(function (err, count) {

        if (count > 0) {
            console.log("found the item");
            console.log(upcU);

            var document = {
                $inc: {
                    quantity: quantityU
                },
                $push: {
                    logs: {
                        inventoryPersonId: uid,
                        date: dateU,
                        quantity: quantityU
                    }
                }
            };
            Inv.update({
                upc: upcU
            }, document, {
                safe: true
            }, function (err, doc) {
                if (err) return res.jsonp({
                    message: "ERROR: on adding quantity for the item "
                });;
                res.jsonp(document);
            });
        } else {
            //console.log("didn't find the item");
            //console.log(upcU);
            var nameU = req.body.name;
            var pictureU = req.body.picture;
            //var onHandQuU = req.body.onHandQuFE;
            var priceU = req.body.price;

            var newItem = new Inv({
                upc: upcU,
                name: nameU,
                picture: pictureU,
                quantity: quantityU,
                onHoldQu: quantityU,
                soldQu: soldQuU,
                price: priceU,
                logs: [{
                    inventoryPersonId: uid,
                    date: dateU,
                    quantity: quantityU
                }]
            });

            newItem.save(function (err, doc) {
                if (err) {
                    return res.jsonp({
                        message: "ERROR: on updating the customer "
                    });
                } else {
                    res.jsonp(newItem);
                }
            });
        }
    });
};

//update all the new values for an item
//inputs: upcFE, quantityFE,nameFE, pictureFE, priceFE, onHoldQuFE, soldQu
exports.editItem = function (req, res) {
    var uid = req.session.uid;

    if (uid === undefined)
        return res.jsonp({
            message: "Authentication failed"
        });

    var upcU = req.body.upc;
    var quantityU = req.body.quantity;
    var nameU = req.body.name;
    var pictureU = req.body.picture;
    var priceU = req.body.price;
    var dateU = new Date();
    var onHoldQuU = req.body.onHoldQu;
    var soldQuU = req.body.soldQu;



    var document = {
        upc: upcU,
        name: nameU,
        picture: pictureU,
        quantity: quantityU,
        onHoldQu: onHoldQuU,
        soldQu: soldQuU,
        price: priceU,
        $push: {
            logs: {
                inventoryPersonId: uid,
                date: dateU,
                quantity: quantityU
            }
        }
    };

    Inv.update({
        upc: upcU
    }, document, {
        safe: true
    }, function (err, doc) {
        if (err) {
            console.log(err);
            return res.jsonp({
                message: "ERROR: on updating the customer "
            });
        } else {
            res.redirect('/dashboard');
        }
    });
};

//chec if item exist if yes rerout to /inventory/addItemError else adds the item
//inputs: upcFE, quantityFE,nameFE, pictureFE, priceFE ,[onHoldQuFE:0], [soldQu:0]
exports.addItem = function (req, res) {
    uid = req.session.uid;
    console.log(uid);
    if (uid === undefined)
        return res.jsonp({
            message: "Authentication failed"
        });
    var upcU = req.body.upc;
    var quantityU = req.body.quantity;
    var nameU = req.body.name;
    var pictureU = req.body.picture;
    var priceU = req.body.price;
    var dateU = new Date();
    var onHoldQuU = 0;
    var soldQuU = 0;

    if (req.body.onHoldQu)
        onHoldQuU = req.body.onHoldQu;
    if (req.body.sold)
        soldQuU = req.body.soldQu;


    Inv.find({
        upc: upcU
    }).count(function (err, count) {
        if (count > 0) {
            //username already exists
            console.log("Signup Error: " + upcU + " already exists");
            res.jsonp("/inventory/addItemError");
        } else {
            var newItem = new Inv({
                upc: upcU,
                name: nameU,
                picture: pictureU,
                quantity: quantityU,
                onHoldQu: onHoldQuU,
                soldQu: soldQuU,
                price: priceU,
                logs: [{
                    inventoryPersonId: uid,
                    date: dateU,
                    quantity: quantityU
                }]
            });

            newItem.save(function (err, doc) {
                if (err){
                    return res.jsonp({
                        message: "ERROR: on updating the customer "
                    });
                  }else{
                    res.jsonp(doc);
                  }
            });
        }
    });
};

//search for an item. If upcFE is given then it will search by upc else search by name
//to get all the data call the function using empty creteriaFE.
//Inputs: upcFE, creteriaFE
exports.searchItem = function (req, res) {
    var uid = req.session.uid;

    if (uid === undefined)
        return res.jsonp({
            message: "Authentication failed"
        });


    var upcU = req.body.upc;

    var nameU = req.body.creteria;

    if (upcU) {

        Inv.find({
            upc: upcU
        }, function (err, doc) {
            //console.log("upc search");
            res.jsonp(doc);
            //console.log(upcU);
        });

    } else {
        Inv.find({
            name: new RegExp(nameU, 'i')
        }, function (err, doc) {
            if (err) {
                return res.jsonp({
                    message: "ERROR: on updating the customer "
                });
            }
            //console.log("name search");
            res.jsonp(doc);
        });
    }
};