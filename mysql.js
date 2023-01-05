var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : '111111',
  database : 'classMySQL'
});
 
connection.connect();
 
connection.query('SELECT * FROM author', function (error, results, fields) {
  if (error){
    console.log(error)
  };
  console.log(results);
});
 
connection.end();