var express = require('express');
var morgon = require('morgan');

var app = express();
app.use(morgon('tiny'));
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port', process.env.PORT || 3000);
});

require('./routes.js')(app);