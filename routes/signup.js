var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

var db = require('./db');
var util = require("util");


exports.signup = function(req, res){
  res.render('signup',{error:""});
};

exports.create = function(req,res)
{	
	var password = bcrypt.hashSync(req.body.password, salt);
	
	var query = util.format(" INSERT INTO `user` (`email`, `firstname`, `lastname`, `password`, `mobilenumber`, `birthday`, `gender`) \
								VALUES ( '%s', '%s', '%s', '%s', '%s', '%s', '%s')", req.body.email,req.body.firstname,req.body.lastname
								,password,req.body.mobile,req.body.birthday,req.body.gender);
	db.getConnection(function(err, conn){
	conn.query(query, function(err,rows,fields){
		if(err){
			console.log("signup failed");
		}
		else{
			console.log("signup success");
		}
	});
	conn.release();
	});
	res.redirect('/');
};
