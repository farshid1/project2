var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var inventory = new Schema({
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
}); 

var inventory = mongoose.model('inventory', inventory);

module.exports = inventory;