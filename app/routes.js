var inventory = require('./controllers/inventory.js');
var user = require('./controllers/user.js');
var sales = require('./controllers/sales.js');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// User routes :
	app.post('/api/user/login', user.login);
	app.post('/api/user/add', user.add);
	app.get('/api/user/logout', user.isAuthenticated, user.logout);
	app.post('/api/user/update', user.isAuthenticated, user.update);

	//Inventory routes :
	app.post('/api/inventory/addItem',user.isAuthenticated, inventory.addItem);
	app.post('/api/inventory/editItem', user.isAuthenticated, inventory.editItem);
	app.post('/api/inventory/addQuantity', user.isAuthenticated, inventory.addQuantity);
	app.post('/api/inventory/searchItem', user.isAuthenticated, inventory.searchItem);
	
	//Sales routes : 
	app.post('/api/sales/addToCart', user.isAuthenticated,sales.addToCart);
	app.post('/api/sales/searchCustomer', user.isAuthenticated,sales.searchCustomer);
	app.post('/api/sales/addNewCustomer', user.isAuthenticated,sales.addNewCustomer);
	app.post('/api/sales/editCustomer', user.isAuthenticated,sales.editCustomer);


	
	//app.post('/api/sales/searchProduct',user.isAuthenticated, sales.seachProduct);
	app.post('/api/sales/FinalizeInvoice',user.isAuthenticated ,sales.FinalizeInvoice);
	
	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};