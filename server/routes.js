var path = require('path');
var public = path.resolve(__dirname, '..', 'public');
var db = require(path.resolve(__dirname, '..', 'db/db.js'));
var clockID = process.env.CLOCK || 1;

module.exports = function(app){

  app.get('/', function(req, res){
    res.sendFile(public + '/client/index.html');
  });
  
  app.get('/api/wait/', function(req, res){
    db.getTime(clockID, function (time) {
      res.send(JSON.stringify(time));
    });
  });
  
  app.post('/api/wait/', function(req, res){
    var current = parseInt(req.body.newWait);
    db.setTime(clockID, current);
    res.send(200);
  });
  
  app.get('*', function(req, res) {
    res.sendFile(public + req.url);
  });
    
};