var mysql = require('mysql');

var connection = mysql.createConnection(process.env.DATABASE_URL || {
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
      CREATE TABLE IF NOT EXISTS `locations` (\
        `id` INT(8) NOT NULL AUTO_INCREMENT,\
        `name` varchar(20) NOT NULL UNIQUE,\
        PRIMARY KEY (`id`)\
      );\
    ");
    connection.query( "\
      CREATE TABLE IF NOT EXISTS `clocks` (\
        `id` INT(8) NOT NULL AUTO_INCREMENT,\
        `name` varchar(20) NOT NULL,\
        `time` INT(13) NOT NULL DEFAULT 1800000,\
        `location_id` INT(6) NOT NULL DEFAULT 1,\
        PRIMARY KEY (`id`),\
        FOREIGN KEY (`id`) REFERENCES locations (`id`)\
      );\
    ");
    connection.query("INSERT INTO locations (name) VALUES ('riesenable.io')", function(err, results, fields) {
      if(err) {
        console.error(err);
      }
    });
    connection.query("INSERT INTO clocks (name, location_id) VALUES ('Wait Clock Demo', \
        (SELECT id FROM locations WHERE name='riesenable.io')\
      )", function(err, results, fields) {
      if(err) {
        console.error(err);
      }
    });
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