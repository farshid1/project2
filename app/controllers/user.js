
//user controller

var mongoose = require('mongoose'),
    User = require('../models/user.js');


//-Check if the desired username already exists
function doesUserExist(req, res, callback){
  var user = req.body.username,
    pass = req.body.password;

    User.find({email: user}).count(function(err, count){
      if (count > 0){
        //username already exists
        console.log("Signup Error: " + user + " already exists");
        res.redirect("/user/signup/error");
      }
      else{
        //username does not exist, create it
        console.log("User does not exist");
        callback(req);
        res.jsonp({message :" The user has been added"});
    }
 });
}

//Create the user
function createUser(req){

    var user = req.body.username,
   pass = req.body.password,
   first = req.body.firstName,
   last = req.body.lastName,
   phone = req.body.phoneNumber,
   urole = req.body.role;

   var docs = {email: user, password : pass, firstName :first, lastName: last, phoneNumber :phone,
      role: urole} ;

     var temp = new User(docs);
                temp.save(function (err, admin) {
                    if (err) {
                        return console.error(err);
                    } else {
                        console.log('message : "The new order has beeen added into the cart');
                    }


                });
}
//called on 'user/add' POST
exports.add = function(req, res) {
  if(req.session.urole === 1){ 
  doesUserExist(req, res, createUser);
}
else {
  res.redirect('/dasboard');
}
};


function findUser(userId){
   User.findOne({_id: userId},{_id:1, role:1,firstName:1,lastName:1}, 
    function(err, doc) {
      if (err) {
        console.error(err);
      }
      if (doc) {
        console.log("USER: '" + userId + "' successfully was sent back");
        return doc;
      }
      else {
        console.log("USER: '" + userId + "'" + " invalid credentials");
        return ({message: "something bad happend!!"});
        //res.redirect('/login');
      }
  });
}

//- Attempt to log user in and create session cookie
exports.login = function(req, res) {

  if (req.session.uid) {
    console.log(req.session.uidOb);
    var user = findUser(req.session.uid)
    return res.jsonp({email: req.session.uid, role: req.session.urole});
  }
    var user = req.body.username,
    pass = req.body.password;

  User.findOne({email: user, password: pass},{_id:1, role:1,firstName:1,lastName:1}, 
    function(err, doc) {
      if (err) {
        console.error(err);
      }
      if (doc) {
        console.log("USER: '" + user + "' successfully authenticated");
        console.dir(doc);
        console.log ("uid is : "+doc._id);
        req.session.uid = parseInt( "0x"+doc._id);
        req.session.uidOb = doc._id;
        req.session.urole = doc.role;
        console.log(req.session.urole);
        console.log("USER: '" + user + "'" + " valid credentials");
        res.jsonp(doc);
      }
      else {
        console.log("USER: '" + user + "'" + " invalid credentials");
        res.jsonp({message: "couldn't find"});
        //res.redirect('/login');
      }
});

};

exports.update = function(req,res){
  var uid = req.session.uid,
      user=req.body.username,
      pass =req.body.password,
   first = req.body.firstName,
   last = req.body.lastName,
   phone = req.body.phoneNumber;

  if (!uid)
    return res.jsonp("/login");

  //  var collection = db.collection('users');
  User.findOne({username: user}, function(err, doc) {
    if (err) {
      throw err;
    }
    if (!doc) {
      var document = {email: user, password : pass, firstName :first, lastName: last, phoneNumber :phone};
      User.update(
        { _id: uid }, document, {safe: true}, function(err, doc) {
          if (err) throw err;
          console.log("Record updated as " + doc);
          res.jsonp({message: "The user has benn updated"});
          //db.close();
        });
    } else {
      console.log("No user found");
      res.jsonp({message : "No user found"});
    }
  });
};




exports.logout = function(req,res){
  delete req.session.uid;
    res.redirect("/login");
};

// - check if user is authenticated, proceed if true. Use this callback for proceeding to authenticated pages
exports.isAuthenticated = function(req, res, next){
  //user is trying to access protected page
  if (!req.session.uid) {
   
    res.jsonp("/login");
  }
  //authenticated user, proceed
  else {
    next();
  }
}