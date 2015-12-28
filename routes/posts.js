var db = require('./db');
var util = require("util");


exports.poststatus = function(req, res){
	var query = util.format(" INSERT INTO `posts` (`userid`, `post`) \
			VALUES ( '%s', '%s')", req.facebook.user.userid,req.body.status);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Posting status failed");
			}
			else{
				res.send("success");
			}
		});	
		conn.release();
	});
};


exports.getstatus = function(req,res){
	console.log(req.query.userid);
	var userid = req.query.userid ? req.query.userid:req.facebook.user.userid;
	var query = util.format("SELECT p.post, u.firstname, u.lastname,u.userid FROM user u join posts p on u.userid = p.userid WHERE u.userid =%s OR  \
				u.userid in (SELECT frienduserid FROM friends f WHERE  f.userid = %s AND f.accepted =1) OR u.userid in \
				(SELECT userid FROM friends f WHERE  f.frienduserid =%s AND f.accepted =1) order by p.postid desc",
				userid,userid,userid);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Getting posts failed:"+err);
			}
			else{
				res.send(rows);
			}
		});
		conn.release();
	});
}

//"SELECT p.post, u.firstname FROM user u join posts p on u.userid = p.userid WHERE u.userid ="+req.facebook.user.userid+" OR " +
//"	u.userid in (SELECT frienduserid FROM friends f WHERE  f.userid = "+req.facebook.user.userid+" AND f.accepted =1) OR u.userid in " +
//"	(SELECT userid FROM friends f WHERE  f.frienduserid ="+req.facebook.user.userid+" AND f.accepted =1)"


//"SELECT p.`post`,u.`firstname`,u.`lastname` from `posts` p JOIN `user` u \
//ON p.userid=u.userid WHERE p.userid=%s",req.facebook.user.userid