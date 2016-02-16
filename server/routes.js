var path = require('path');

var public = path.resolve(__dirname, '..', 'public');

var db = require(path.resolve(__dirname, '..', 'db/db.js'));

var current = 1800000;

module.exports = function(app){

  app.get('/', function(req, res){
    res.sendFile(public + '/client/index.html');
  });
  
  app.get('/api/wait/', function(req, res){
    res.send(JSON.stringify(current));
  });
  
  app.post('/api/wait/', function(req, res){
    console.log(req.body);
    current = parseInt(req.body.newWait);
    res.send(200);
  });
  
  app.get('*', function(req, res) {
    res.sendFile(public + req.url);
  });
    
};