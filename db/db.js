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
    connection.query( "\
      CREATE TABLE IF NOT EXISTS `clocks` (\
        `id` INT(8) NOT NULL AUTO_INCREMENT,\
        `name` varchar(20) NOT NULL DEFAULT 'WAIT CLOCK',\
        `time` INT(13) NOT NULL,\
        `location_id` INT(6) NOT NULL DEFAULT 1,\
        PRIMARY KEY (`id`)\
      );\
      SET @@auto_increment_increment=1;\
      ALTER TABLE Persons AUTO_INCREMENT=1\
    ");
  }
});

module.exports.setTime = function (clock, time) {
  connection.query("UPDATE clocks SET time = ? WHERE id = ?", [time, clock]);
};

module.exports.getTime = function (clock, cb) {
  connection.query("SELECT time FROM clocks WHERE id = ?", [clock], function (err, results, fields) {
    if(results.length > 0) {
      cb(results[0].time);
    } else {
      connection.query("INSERT INTO clocks (time) VALUES (?)", [1800000]);
      cb(1800000);
    }
  });
};