
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , sessions = require('client-sessions')
  , login = require('./routes/login')
  , home = require('./routes/home')
  , signup = require('./routes/signup')
  , posts = require('./routes/posts')
  , friends = require('./routes/friends')
  , about = require('./routes/about') 
  , groups = require('./routes/groups');

var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(sessions({
	  cookieName: 'facebook', 
	  secret: 'facebook'
	  }));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function IsAuthenticated(req,res,next){
    if(req.facebook.user){
        next();
    }else{
    	req.facebook.redirect_to = req.path;
        res.render('login',{error:""});
    }
}

app.get('/', login.login);
app.get('/home', IsAuthenticated, home.home);
app.get('/logout', IsAuthenticated, login.logout);
app.get('/signup', signup.signup);
app.post('/',login.checklogin);
//app.post('/', routes.index);
app.post('/signup', signup.create);
app.post('/poststatus', IsAuthenticated, posts.poststatus );
app.get('/getinterests', IsAuthenticated, about.getinterests );
app.post('/postinterests', IsAuthenticated, about.postinterests );
app.post('/deleteinterests', IsAuthenticated, about.deleteinterests );
app.post('/postabout', IsAuthenticated, about.saveabout );
app.get('/getallusers', IsAuthenticated, user.getallusers);
app.get('/interests', IsAuthenticated, about.interests)
app.get('/about', IsAuthenticated, about.about);
app.get('/getaboutme', IsAuthenticated, about.getdetails);
app.get('/profile/:userid', IsAuthenticated,about.profile);
app.post('/frndaction', IsAuthenticated,about.frndaction);
app.get('/getstatus', IsAuthenticated, posts.getstatus);
app.get('/getfriends',IsAuthenticated, friends.getfriends);
app.get('/friends',IsAuthenticated, friends.home);
app.get('/groups',IsAuthenticated, groups.groups);
app.post('/deletegroup', IsAuthenticated, groups.deletegroup );
app.post('/creategroup', IsAuthenticated, groups.creategroup );
app.post('/joingroup', IsAuthenticated, groups.joingroup );
app.post('/exitgroup', IsAuthenticated, groups.exitgroup );
app.get('/getallgroups', IsAuthenticated, groups.getallgroups );
app.get('/getgroups', IsAuthenticated, groups.getgroups );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
