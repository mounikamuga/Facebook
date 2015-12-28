/*var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'cmpe273',
  socketPath:'/tmp/mysql.sock'
});

connection.connect(function(err) {
  if(err){
	console.log('Not connected to db');
  }
});
module.exports = connection;*/


var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'cmpe273',
  socketPath:'/tmp/mysql.sock'
});

module.exports = pool;
