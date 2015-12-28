exports.home = function(req, res){
  res.render('home', { name:req.facebook.user.firstname+" " +req.facebook.user.lastname });
};