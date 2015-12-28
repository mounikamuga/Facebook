var db = require('./db');
var util = require("util");


exports.getfriends = function(req,res){
	var query = util.format("SELECT userid, firstname, lastname FROM user WHERE  \
			userid in (SELECT frienduserid FROM friends f WHERE  f.userid = %s AND f.accepted =1) OR userid in \
			(SELECT userid FROM friends f WHERE  f.frienduserid =%s AND f.accepted =1)",
			req.facebook.user.userid,req.facebook.user.userid);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Getting friends failed:"+err);
			}
			else{
				res.send(rows);
			}
		});
		conn.release();
	});
};

exports.home = function(req, res){
	  res.render('friends', { name:req.facebook.user.firstname +" " + req.facebook.user.lastname });
	};