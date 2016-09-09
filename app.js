'use strict';

require('dotenv').config();
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var cors = require('cors');
app.use(cors());

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 10010;
  var host = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

  app.listen(port, host);
});
