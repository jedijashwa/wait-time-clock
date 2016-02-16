var path = require('path');
var jwt = require('express-jwt');
var public = path.resolve(__dirname, '..', 'public');
var db = require(path.resolve(__dirname, '..', 'db/db.js'));
var clockID = process.env.CLOCK || 1;

var jwtCheck = jwt({
  secret: new Buffer('83xgRTMwO3DkotHIKH62x6K__x-VoYoH_q8pocaoRsnj1RLMd2CCSsphAwxuABfE', 'base64'),
  audience: '3y4I7YR2w0tbSitWGGA5aedYF8Apx4ts'
});

module.exports = function(app){
  
  app.use('/api/update', jwtCheck);

  app.get('/', function(req, res){
    res.sendFile(public + '/client/index.html');
  });
  
  app.get('/api/wait/', function(req, res){
    db.getTime(clockID, function (time) {
      res.send(JSON.stringify(time));
    });
  });
  
  app.post('/api/update/', function(req, res){
    var current = parseInt(req.body.newWait);
    db.setTime(clockID, current);
    res.send(200);
  });
  
  app.get('*', function(req, res) {
    res.sendFile(public + req.url);
  });
    
};