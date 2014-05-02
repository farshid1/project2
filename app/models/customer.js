var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var customerSchema = new Schema({
	customerId : {type: Number, index: { unique: true }},
    firstName: {type: String,trim: true, required: true},
    lastName: {type: String,trim: true, required: true},
    phoneNumber: {type: Number},
    email:{type: String, required: true},
    address:{type : String,trim: true}
    
});

var customer = mongoose.model('customer', customerSchema);

module.exports = customer;

