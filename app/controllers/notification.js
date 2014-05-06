var mongoose = require('mongoose'),
    notification = require('../models/inventory.js');


exports.addnotificaiton = function(req,res){

  var users[] = req.body.users;
  var message = req.body.message;

        var newNotification = new  notification ( message: message, 
        users: users);

      newItem.save(function(err, doc) {
      if (err) 
        throw err;
      res.redirect('/dashboard');
      });
        }
    }); 
};