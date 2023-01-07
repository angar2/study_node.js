var mysql = require('mysql');
var secret = require('../secrets.json').db
var db = mysql.createConnection({
    host     : 'localhost',
    user     : secret.user,
    password : secret.password,
    database : 'classMySQL'
  });
  db.connect();

  module.exports = db;