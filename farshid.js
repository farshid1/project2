// modules =================================================
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');
var user = require('./app/models/user.js');
var users = [];
var _ = require('underscore');

// configuration ===========================================

// config files
var db = require('./config/db');

var port = process.env.PORT || 8080; // set our port
mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)


app.configure(function () {
    app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
    app.use(express.logger('dev')); // log every request to the console
    app.use(express.bodyParser()); // pull information from html in POST
    app.use(express.methodOverride()); // simulate DELETE and PUT
    app.use(express.cookieParser());
    app.use(express.session({
        secret: "$ecreT"
    }));

});

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================

server.listen(port);

//Read the db to make sure the admin has been inserted to the db.	
user.findOne({
    role: 1
}, "email firstName lastName", function (err, userResult) {
    if (err) return console.error(err);
    if (userResult === null) {
        console.log("doens't exist");
        var admin = new user({
            role: 1,
            firstName: "admin",
            lastName: "admin",
            phoneNumber: 0,
            email: "admin@admin.com",
            password: "admin"
        });
        admin.save(function (err, admin) {
            if (err) return console.error(err);
            admin;
        });
    } else {
        console.log(userResult)
    }
});


//socket IO part:
io.sockets.on('connection', function (socket) {
    //console.log('connected*******************');


    socket.on('log in', function (data) {
        socket.role = data.role;
        socket.userId = data._id;
        users.push (socket);
        console.log("in the log in");
        console.log(data);
        console.log(users.length);
        _.each (users, function(user){
    		if(user.role == 1){
    			console.log("user found");
    			user.emit('news', {userid: user.userId});
    		}
    	})
    });

    socket.on('test', function (data){
    	_.each (users, function(user){
    			console.log("Found the user");
    	})
    });

    socket.on('disconnect', function (data) {
        if (!socket.userId) return;
        console.log("in disconnect" + users.length);
        delete users[indexOf(socket)];
        console.log("after disconnect" + users.length);


    });

});

console.log('Magic happens on port ' + port); // shoutout to the user
exports = module.exports = app; // expose app

