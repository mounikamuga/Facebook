var db = require('./db');
var util = require("util");

exports.groups = function(req,res){
	res.render('groups',{ name:req.facebook.user.firstname +" " + req.facebook.user.lastname, userid:req.facebook.user.userid});
};

exports.creategroup = function(req, res){
	var query = util.format(" INSERT INTO `groups` (`groupname`, `adminuserid`) \
			VALUES ( '%s', '%s')",req.body.groupname, req.facebook.user.userid);
	console.log(query);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Group creation failed");
			}
			else{
				var query = util.format(" INSERT INTO `groupsusers` (`groupid`, `userid`) \
						VALUES ( '%s', '%s')",rows.insertId, req.facebook.user.userid);
				console.log(query);

				conn.query(query, function(err,rows,fields){
					if(err){
						console.log("Group creation failed");
					}
					else{
					res.send("success");
					}
				});
				}
		});	
		conn.release();
	});
};

exports.deletegroup = function(req, res){
	var query = util.format(" DELETE FROM `groups` WHERE `groupid`=%s", req.body.groupid);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Deleting groups failed");
			}
			else{
				res.send("success");
			}
		});	
		conn.release();
	});
};

exports.joingroup = function(req, res){
	var query = util.format(" INSERT INTO `groupsusers` (`groupid`, `userid`) \
			VALUES ( '%s', '%s')",req.body.groupid, req.facebook.user.userid);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Joining group failed");
			}
			else{
				res.send("success");
			}
		});	
		conn.release();
	});
};


exports.exitgroup = function(req, res){
	var query = util.format(" DELETE FROM `groupsusers` WHERE `userid`=%s AND `groupid`=%s", req.facebook.user.userid, req.body.groupid);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Group creation failed");
			}
			else{
				res.send("success");
			}
		});	
		conn.release();
	});
};


exports.getgroups = function(req, res){
	var userid = req.query.userid ? req.query.userid:req.facebook.user.userid;
	var query = util.format(" SELECT g.groupid, g.adminuserid, g.groupname  FROM `groupsusers` gu\
			 join groups g ON g.groupid=gu.groupid WHERE gu.userid=%s",userid );
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Group fetch failed");
			}
			else{
				res.send(rows);
			}
		});	
		conn.release();
	});
};

exports.getallgroups = function(req, res){
	var query = util.format(" SELECT * FROM `groups` WHERE groupname LIKE '%s%' AND adminuserid<>%s and \
			groupid NOT IN (SELECT groupid from groupsusers where userid=%s)", req.query.gname,req.facebook.user.userid,req.facebook.user.userid);
	console.log(query);
	db.getConnection(function(err, conn){
		conn.query(query, function(err,rows,fields){
			if(err){
				console.log("Group fetch failed");
			}
			else{
				res.send(rows);
			}
		});	
		conn.release();
	});
};

