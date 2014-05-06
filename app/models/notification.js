var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var notificationSchema = new Schema({
    message: String,
    users: [{userId: }]
    //created_at : {type: Date, required: true, default: Date.now }
});

var notification = mongoose.model('user', notificationSchema);

module.exports = notification;