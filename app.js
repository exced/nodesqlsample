// mysql DB connection
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'BDR',
  password : 'BDR',
  database : 'BDRDB'
});

connection.connect();

connection.query('SELECT * ', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.end();

