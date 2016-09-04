'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var request = require('request');

var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGeneratorProd = new FirebaseTokenGenerator(process.env.PROD_FIREBASE_SECRET);
var tokenGeneratorTest = new FirebaseTokenGenerator(process.env.TEST_FIREBASE_SECRET);

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  ip: firebaseauth_ip,
  ip_test: firebaseauth_ip_test,
  mfgt: firebaseauth_mfgt,
  mfgt_test: firebaseauth_mfgt_test,
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */

var AUTH_IPS = { "109.205.200.60": true };

function createToken(req, tokenGenerator) {
  var token = null;
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (AUTH_IPS[ip]) {
    var auth_payload = { "uid": "ipauth", "ip": ip }
    token = tokenGenerator.createToken(auth_payload)
  }
  return { "token": token }
}

function firebaseauth_ip(req, res) {
  var token = createToken(req, tokenGeneratorProd);
  res.json(token);
}

function firebaseauth_ip_test(req, res) {
  var token = createToken(req, tokenGeneratorTest);
  res.json(token);
}

function verifyMFGTLogin(username, password, cb) {
  var url = "https://www.mfgt.ch/auth/auth.php"
  var values = {'username': username, 'password': password};
  request({'url': url, 'method': 'POST','form': values}, function(error, response, body) {
    cb(body.trim() == "OK");
  });
}

function firebaseauth_common(req, tokenGenerator, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var username = req.swagger.params.username.value;
  var password = req.swagger.params.password.value;
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  verifyMFGTLogin(username, password, function(ok) {
    var token = null;
    if (ok) {
      var auth_payload = { "uid": username, "ip": ip }
      token = tokenGenerator.createToken(auth_payload);
    };
    res.json({'token': token});
  });
}

function firebaseauth_mfgt(req, res) {
  firebaseauth_common(req, tokenGeneratorProd, res);
}

function firebaseauth_mfgt_test(req, res) {
  firebaseauth_common(req, tokenGeneratorTest, res);
}
