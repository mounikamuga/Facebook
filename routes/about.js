var db = require('./db');
var util = require("util");

var getuser = function(userid){
	var query=util.format("SELECT * FROM `user` WHERE userid='%s'",userid);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err)
			{
				console.log("Getting user failed"+ err);
			}
			else
			{
				return rows[0];
			}
		});
		conn.release();
	});
};


exports.about = function(req, res){
	res.render('about', { name:req.facebook.user.firstname +" " + req.facebook.user.lastname});
	
};

exports.getdetails = function(req, res){
	res.send(req.facebook.user);
};

exports.saveabout = function(req,res){
	var query = util.format(" UPDATE  `user` SET `email`='%s', `firstname`='%s', `lastname`='%s', `mobilenumber`='%s', `birthday`='%s',\
			workexperience='%s', description='%s', lifeevents='%s',education='%s' WHERE userid='%s'"
			, req.body.email,req.body.firstname,req.body.lastname,req.body.mobilenumber,new Date(req.body.birthday).toISOString().slice(0,10),req.body.workex,req.body.description
			,req.body.lifeevents,req.body.education,req.facebook.user.userid );
	console.log(query);
	db.getConnection(function(err, conn){			
		conn.query(query, function(err,rows,fields){
					if(err){
					console.log("Update failed");
					}
					else{
						var query=util.format("SELECT * FROM `user` WHERE userid='%s'",req.facebook.user.userid);
						conn.query(query, function(err,rows,fields){
							if(err)
							{
								console.log("Getting user failed"+ err);
							}
							else
							{
								req.facebook.user = rows[0];
								res.send("About Updated Successfully");
							}
						});
						
					}
			});
		conn.release();
	});
};
				
exports.profile = function(req,res){
	if(req.params.userid==req.facebook.user.userid)
		{
			res.render("home",{name:req.facebook.user.firstname+" "+req.facebook.user.lastname});
		}
	var query=util.format("SELECT * FROM `user` WHERE userid='%s'",req.params.userid);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err)
			{
				console.log("Getting user failed"+ err);
			}
			else
			{
				var user = rows[0];
				user.birthday = new Date(user.birthday).toISOString().slice(0,10);
				var query = util.format("SELECT * FROM friends WHERE (`userid`=%s AND `frienduserid`=%s) OR (`userid`=%s AND `frienduserid`=%s) ",
						req.facebook.user.userid, req.params.userid, req.params.userid, req.facebook.user.userid);
				conn.query(query, function(err,rows,fields){
					var action = 0;//0 for addfriend 1-cancel req 2-Unfriend 3-accept req 
					if(rows.length>0){					
						if(rows[0].userid==req.facebook.user.userid){						
							if(parseInt(rows[0].accepted)==0){							
								action=1;
							}
							else{							
								action=2;
							}	
						}
						else{
							if(parseInt(rows[0].accepted)==0){							
								action=3;
							}
							else{							
								action=2;
							}
						}
					}
					res.render("profile",{user:user, action:action , name:req.facebook.user.firstname +" " + req.facebook.user.lastname});
				});	
			}
		});
	conn.release();
	});
};

exports.frndaction = function(req,res){
	var query;
	var action = req.body.action ;
	console.log(action);
	switch(parseInt(action)){
	case 0:
		query = util.format("INSERT INTO `friends` (`userid`,`frienduserid`,`accepted`) VALUES (%s ,%s,%s)" 
				,req.facebook.user.userid, req.body.frndid, 0 );
		break ;
	case 1:
		query = util.format("DELETE FROM `friends` WHERE `userid`=%s AND `frienduserid`=%s" 
				,req.facebook.user.userid, req.body.frndid );
		break ;
	case 2:
	case 4:
		query = util.format("DELETE FROM `friends` WHERE (`userid`=%s AND `frienduserid`=%s) OR (`userid`=%s AND `frienduserid`=%s)" 
				,req.facebook.user.userid, req.body.frndid,req.body.frndid ,req.facebook.user.userid );
		break ;
	case 3:
		query = util.format("UPDATE `friends` SET  `accepted`=1 WHERE (`userid`=%s AND `frienduserid`=%s)" 
				,req.body.frndid ,req.facebook.user.userid );
		break ;
	}
	console.log(query);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err)
			{
				console.log("Friend action failed"+ err);
			}
			else
			{
				res.send("Success");
			}
		});
		conn.release();
	});
}



exports.getinterests = function(req,res){
	var userid = req.query.userid ? req.query.userid:req.facebook.user.userid;
	var query = util.format("SELECT interestsid, interest FROM interests where userid=%s", userid);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Getting interests failed:"+err);
			}
			else{
				res.send(rows);
			}
		});
		conn.release();
	});
};

exports.postinterests = function(req, res){
	var query = util.format(" INSERT INTO `interests` (`userid`, `interest`) \
			VALUES ( '%s', '%s')", req.facebook.user.userid,req.body.interest);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Posting interests failed");
			}
			else{
				res.send("success");
			}
		});	
		conn.release();
	});
};


exports.interests = function(req, res){
	res.render('interests', { name:req.facebook.user.firstname +" " + req.facebook.user.lastname});
	
};

exports.deleteinterests = function(req, res){
	var query = util.format(" DELETE FROM `interests` WHERE `interestsid`=%s", req.body.interestsid);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Deleting interests failed");
			}
			else{
				res.send("success");
			}
		});	
		conn.release();
	});
};
