var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var customerSchema = new Schema({
    firstName: {type: String,trim: true, required: true},
    lastName: {type: String,trim: true, required: true},
    phoneNumber: {type: Number},
    email:{type: String, required: true},
    address:{type : String,trim: true}
    
});

var customer = mongoose.model('customer', customerSchema);

module.exports = customer;

