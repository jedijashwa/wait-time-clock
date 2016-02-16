var mysql = require('mysql');

var connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL || {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'waitclock'
});

connection.connect(function (err) {
  if (err) {
    console.error(err);
  } else {
    connection.query( " CREATE TABLE 'clocks' ('id' INTEGER(8) NOT NULL AUTO_INCREMENT, 'name' varchar(20) NOT NULL, 'time' INTEGER(13) NOT NULL, 'location_id' INTEGER(6) NOT NULL UNIQUE, PRIMARY KEY ('id') );");
  }
});

module.exports.setTime = function (clock, time) {
  connection.query("UPDATE clocks SET time = ? WHERE id = ?", [time, clock]);
};

module.exports.getTime = function (clock, cb) {
  connection.query("SELECT time FROM clocks WHERE id = ?", [clock], cb);
};