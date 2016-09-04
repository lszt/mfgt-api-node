'use strict';

require('dotenv').config();
var SwaggerConnect = require('swagger-connect');
var app = require('connect')();
var cors = require('cors');
app.use(cors());

console.log(process.env);
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerConnect.create(config, function(err, swaggerConnect) {
  if (err) { throw err; }

  // install middleware
  swaggerConnect.register(app);

  var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 10010;
  var host = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

  app.listen(port, host);
});
