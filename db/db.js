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
        CONSTRAINT `clocks_fk0` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`)\
      );\
    ");
    connection.query("INSERT IGNORE INTO locations (name) VALUES ('riesenable.io')", function(err, results, fields) {
      if(err) {
        console.error(err);
      }
    });
    connection.query("INSERT IGNORE INTO locations (name) VALUES ('Apple R031')", function(err, results, fields) {
      if(err) {
        console.error(err);
      }
    });
    connection.query("INSERT IGNORE INTO clocks (name, location_id) VALUES ('Wait Clock Demo', \
        (SELECT id FROM locations WHERE name='riesenable.io')\
      )", function(err, results, fields) {
      if(err) {
        console.error(err);
      }
    });
    connection.query("INSERT IGNORE INTO clocks (name, location_id) VALUES ('Wait Clock Demo 2', \
        (SELECT id FROM locations WHERE name='riesenable.io')\
      )", function(err, results, fields) {
      if(err) {
        console.error(err);
      }
    });
    connection.query("INSERT IGNORE INTO clocks (name, location_id) VALUES ('iPhones', \
        (SELECT id FROM locations WHERE id=2)\
      )", function(err, results, fields) {
      if(err) {
        console.error(err);
      }
    });
    connection.query("INSERT IGNORE INTO clocks (name, location_id) VALUES ('Same Day Repairs', \
        (SELECT id FROM locations WHERE id=2)\
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

// function pushes all contents of table into cb
module.exports.getTable = function (table, sort, cb) {
  sort = sort || 'id';
  connection.query("SELECT * FROM ?? ORDER BY ??", [table, sort], function (err, results, fields) {
    cb(results);
  });
};

module.exports.getClocks = function (location, cb) {
  connection.query("SELECT * FROM clocks WHERE location_id=?", [location], function (err, results, fields) {
    cb(results);
  });
};

module.exports.getClock = function (clock, cb) {
  connection.query("SELECT clocks.name AS name, locations.name AS location FROM clocks LEFT JOIN (locations)\
                    ON (locations.id=clocks.location_id)\
                    WHERE clocks.id=?", [clock], 
    function (err, results, fields) {
      cb(results);
    }
  );
};

module.exports.createLocation = function (location, cb) {
  connection.query("SELECT id FROM locations WHERE name=?", [location],
    function(err, results, fields) {
      if(!results.length) {
        connection.query("INSERT INTO locations (name) VALUES (?)", [location],
          function(err, result) {
            cb(result.insertId);
          });
      } else {
        cb(results[0].id);
      }
  });
};

module.exports.createClock = function(clock, locationID, cb) {
  connection.query("SELECT id FROM clocks WHERE location_id=? and name=?", [locationID, clock],
    function(err, results, fields) {
      if(!results.length) {
        connection.query("INSERT INTO clocks (name, location_id) VALUES (?, ?)",
          [clock, locationID], function (err, result, fields) {
            cb(result.insertId);
          });
      } else {
        cb(results[0].id);
      }
  });
};