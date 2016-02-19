var path = require('path');
var jwt = require('express-jwt');
var public = path.resolve(__dirname, '..', 'public');
var db = require(path.resolve(__dirname, '..', 'db/db.js'));

var jwtCheck = jwt({
  secret: new Buffer('83xgRTMwO3DkotHIKH62x6K__x-VoYoH_q8pocaoRsnj1RLMd2CCSsphAwxuABfE', 'base64'),
  audience: '3y4I7YR2w0tbSitWGGA5aedYF8Apx4ts'
});

// array of all routes that should be behind authentication wall
var authenticationRequired = [
  '/api/update'
];

module.exports = function(app, express){
  
  // serve static files
  app.use(express.static(public))
  
  // uses authentication check for all routes in authenticationRequired
  authenticationRequired.forEach(function (route) {
    app.use(route, jwtCheck);
  });


  app.get('/', function(req, res){
    res.sendFile(public + '/client/index.html');
  });
  
  app.get('/clock/*', function (req, res) {
    res.redirect('/#' + req.originalUrl);
  });
  
  app.get('/clocks/*', function (req, res) {
    res.redirect('/#/clocks');
  });
  
  // api calls
  
  app.get('/api/wait/', function(req, res){
    db.getTime(req.param('clock_id'), function (time) {
      res.send(JSON.stringify(time));
    });
  });
  
  app.post('/api/update/', function(req, res){
    var current = parseInt(req.body.newWait);
    db.setTime(req.param('clock_id'), current);
    res.send(200);
  });
  
  app.get('/api/locations/', function(req, res) {
    db.getTable('locations', 'name', function(results) {
      res.send(results);
    });
  });
  
  app.post('/api/locations/', function(req, res) {
    db.createLocation(req.body.location, function (locationID) {
      db.createClock(req.body.clock, locationID, function (clockID) {
        res.send(JSON.stringify(clockID));
      });
    });
  });
  
  app.get('/api/clocks', function(req, res) {
    db.getClocks(req.param('location_id'), function(results) {
      res.send(results);
    });
  });
  
  app.get('/api/clock', function(req, res) {
    db.getClock(req.param('clock_id'), function(results) {
      res.send(results);
    });
  });
  
  // default to homepage
  app.get('*', function(req, res) {
    res.redirect('/');
  });
    
};