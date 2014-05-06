var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var salesSchema = new Schema({
    salesPersonId: Number,
    comments: String,
    customerId: Number,
    customerName: String,
    totalPrice: Number,
    date: Date,
    state: Number,
    products: [{
        upc: { type :Number},
        name: {type :String},
        quantity: {type :Number},
        price: {type :Number}
    }]
});

var sales = mongoose.model('sales', salesSchema);

module.exports = sales;