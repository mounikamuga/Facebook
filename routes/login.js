var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

var db = require('./db');
var util = require("util");

exports.login = function(req, res){
	if(req.facebook.user)
	{
		res.redirect('/home');
	}
	res.render('login',{error:""});
};

exports.checklogin = function(req,res)
{
	var username = req.body.username;
	var password = req.body.password;
	
    if(username!=='' && password!=='')
	{
		var query=util.format("SELECT * FROM `user` WHERE email='%s'",username);
		db.getConnection(function(err, conn){
			conn.query(query, function(err,rows,fields){
				if(err)
				{
					console.log("Login failed"+ err);
				}
				else if(rows.length==0)
					{
					res.render("login",{"error":"Username or password doesnot exist"});
					}
				else if(bcrypt.compareSync(password, rows[0].password))
				{
					req.facebook.user = rows[0];
					var path = req.facebook.redirect_to ?  req.facebook.redirect_to : '/home';
					delete req.facebook.redirect_to;
					res.redirect(path);
				}
				else 
				{
					res.render('login',{"error":""});
				}	
				
			});
		conn.release();
		});
	}
	else
	{
		res.render('login',{error:"please enter username and password"});
	}
};

exports.logout = function(req, res){
	req.facebook.destroy();
	res.render("login",{"error":""});
	};