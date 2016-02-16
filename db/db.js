var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.JAWSDB_HOST || 'localhost',
  user: process.env.JAWSDB_USERNAME || 'root',
  password: process.env.JAWSDB_PASSWORD || '',
  database: 'waitclock'
});

connection.connect(function (err) {
  if (err) {
    console.error(err);
  }
});

module.exports.setTime = function (clock, time) {
  connection.query("UPDATE clocks SET time = ? WHERE id = ?", [time, clock]);
};

module.exports.getTime = function (clock, cb) {
  connection.query("SELECT time FROM clocks WHERE id = ?", [clock], cb);
};