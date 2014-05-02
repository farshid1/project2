var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var userSchema = new Schema({
	role: { type: Number, min: 1, max: 3 },
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    email: String,
    password: String
});

var user = mongoose.model('user', userSchema);

module.exports = user;
