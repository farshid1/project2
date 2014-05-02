//inventory controller
var mongoose = require('mongoose'),
    Inv = require('../models/inventory.js');

    /*
upc: Number,
    name: String,
    picture: String,
    onHandQu: Number,
    onHoldQu: Number,
    soldQu: Number,
    price: Number,
    logs: [{
    	inventoryPersonId: Number,
    	date: Date,
    	quantity: Number
    }]

*/

exports.addQuantity = function(res,req){
	var uid = req.session.uid;

 	if (uid === undefined)
    	return res.redirect("/login");
   	var upcU = req.body.upcFE;
	var quantityU = req.body.quantityFE;
	var dateU = new Date();

	Inv.find({upc: upcU}).count(function(err, count){
     	 if (count > 0){
     	 	  
     	 	  var document = {$inc: {onHandQu:  quantityU}, 
     	 	  $push: {logs: {inventoryPersonId: uid, date: dateU, quantity: quantityU}}};
		      Inv.update(
		        { upc: upcU }, document, {safe: true}, function(err, doc) {
		          if (err) throw err;
		          res.redirect('/dashboard');
		        });
			}
		else{
			 var upcU = req.body.upcFE;
			 var nameU = req.body.nameFE;
			 var pictureU = req.body.pictureFE;
			 //var onHandQuU = req.body.onHandQuFE;
			 var priceU = req.body.priceFE;
			 var logsU = {inventoryPersonId: uid, date: dateU, quantity: quantityU};

		    Inv.insert({upc: upcU,name: nameU,picture: pictureU,
		    	onHandQu: quantityU,onHoldQu: 0, soldQu:0,price: priceU,
		    	logs: logsU}, function(error, doc){
		    		if(error){
		    		console.log(error);
		    		res.redirect('/dashboard');
		    	}
		    });
		}
	});
};

exports.editItem = function(res,req){
	var uid = req.session.uid;

  	if (uid === undefined)
    	return res.redirect("/login");

	var upcU = req.body.upcFE;
	var quantityU = req.body.quantityFE;
	var nameU = req.body.nameFE;
	var pictureU = req.body.pictureFE; 
	var priceU = req.body.priceFE;
	var dateU = new Date();
	var onHoldQuU = req.body.onHoldQuFE;
	var soldQuU = req.body.soldQu;

	var document = {upc: upcU,name: nameU,picture: pictureU,
		onHandQu: quantityU,onHoldQu: quantityU, soldQu:soldQuU,price: priceU,
		$push: {logs: {inventoryPersonId: uid, date: dateU, quantity: quantityU}}};

	Inv.update(
	{ upc: upcU }, document, {safe: true}, function(err, doc) {
		if (err) throw err;
		res.redirect('/dashboard');
	});
};

exports.addItem = function(res,req){
	var uid = req.session.uid;

  	if (uid === undefined)
    	return res.redirect("/login");

	var upcU = req.body.upcFE;
	var quantityU = req.body.quantityFE;
	var nameU = req.body.nameFE;
	var pictureU = req.body.pictureFE; 
	var priceU = req.body.priceFE;
	var dateU = new Date();
	var onHoldQuU = req.body.onHoldQuFE;
	var soldQuU = req.body.soldQu;

	var document = {upc: upcU,name: nameU,picture: pictureU,
		onHandQu: quantityU,onHoldQu: quantityU, soldQu:soldQuU,price: priceU,
		$push: {logs: {inventoryPersonId: uid, date: dateU, quantity: quantityU}}};

	Inv.insert(document, function(err, doc) {
		if (err) throw err;
		res.redirect('/dashboard');
	});
};

exports.searchItem = function(res,req){
	var uid = req.session.uid;

  	if (uid === undefined)
    	return res.redirect("/login");
	
	var creteriaU = req.body.creteriaFE;
	//var 
	Inv.find({name: new RegExp('.*'+creteriaU+'.*', 'i')}, function(err, docs){
    	res.jsonp(doc);
	});
};
