var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.JAWSDB_URL || 'localhost',
  user: 'root',
  password: '',
  database: 'waitclock'
});

connection.connect();

module.exports.setTime = function (clock, time) {
  connection.query("UPDATE clocks SET time = ? WHERE id = ?", [time, clock]);
};

module.exports.getTime = function (clock, cb) {
  connection.query("SELECT time FROM clocks WHERE id = ?", [clock], cb);
};