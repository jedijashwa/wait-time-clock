var express = require('express');
var morgon = require('morgan');
var bodyParser = require('body-parser');

var app = express();
app.use(morgon('tiny'));
app.use(bodyParser());

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port', process.env.PORT || 3000);
});

require('./routes.js')(app, express);