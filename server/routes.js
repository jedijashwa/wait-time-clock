var path = require('path');

var public = path.resolve(__dirname, '..', 'public');

module.exports = function(app){

  app.get('/', function(req, res){
    res.sendFile(public + '/client/index.html');
  });
    
};