var db = require('./db');
var util = require("util");

exports.getallusers = function(req, res){
	var query = util.format("SELECT u.`userid`,u.`firstname`,u.`lastname` from  `user` u \
			  WHERE u.userid<>%s AND (firstname LIKE '%s%' OR lastname LIKE '%s%')"
			,req.facebook.user.userid,req.query.search,req.query.search);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Getting users failed:"+err);
			}
			else{
				res.send(rows);
			}
		});
		conn.release();
	});
};