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
  }
});

module.exports.setTime = function (clock, time) {
  connection.query("UPDATE clocks SET time = ? WHERE id = ?", [time, clock]);
};

module.exports.getTime = function (clock, cb) {
  connection.query("SELECT time FROM clocks WHERE id = ?", [clock], cb);
};