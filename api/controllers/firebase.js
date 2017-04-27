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
var fnauth = require('../helpers/flightnet');

var FirebaseTokenGenerator = require("firebase-token-generator");
var authProfiles = {};

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
  firebaseauth: firebaseauth,
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */

var AUTH_IPS = { "109.205.200.60": true, "77.59.197.122": true };

var authProfiles = {};

function getAuthProfile(profile) {
  var p = profile.replace(/[^a-z\-]/g, '');
  if (p != profile) {
    return {};
  } else if (authProfiles[profile]) {
    return authProfiles[profile];
  } else {
    p = p.replace(/-/g, '_');
    var PNAME = "AUTH_" + p.toUpperCase();
    console.log(PNAME);
    if (process.env[PNAME + "_FIREBASE_SECRET"]) {
      var newp = {};
      newp.tokenGenerator = new FirebaseTokenGenerator(process.env[PNAME + "_FIREBASE_SECRET"]);
      newp.company = process.env[PNAME + "_COMPANY" ] || profile;
      newp.mode = process.env[PNAME + "_MODE"] || "flightnet";
      authProfiles[profile] = newp;
      return newp;
    } else {
      return {};
    }
  }
}

function firebaseauth_ip_common(req, tokenGenerator, res) {
  var token = null;
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (AUTH_IPS[ip]) {
    var auth_payload = { "uid": "ipauth", "ip": ip }
    token = tokenGenerator.createToken(auth_payload)
  }
  var token = createIPToken(req, tokenGenerator);
  res.json({"token": token});
}

function firebaseauth_none_common(req, tokenGenerator, res) {
  var token = null;
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var auth_payload = { "uid": "none" , "ip": ip };
  var token = tokenGenerator.createToken(auth_payload);
  res.json({"token": token});
}

function firebaseauth_flightnet_common(req, company, username, password, tokenGenerator, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  fnauth.passwordCheck(company, username, password, function(ok) {
    var token = null;
    if (ok) {
      var auth_payload = { "uid": username, "ip": ip }
      token = tokenGenerator.createToken(auth_payload);
    };
    res.json({'token': token});
  });
}

function firebaseauth(req, res) {
  var authsetting = req.swagger.params.authsetting.value;
  var authn = req.swagger.params.authn.value;
  var username = authn.username;
  var password = authn.password;

  var p = getAuthProfile(authsetting);
  if (p) {
    if (p.mode == 'ip') {
      firebaseauth_ip_common(req, p.tokenGenerator, res);
    } else if (p.mode == 'none') {
      firebaseauth_none_common(req, p.tokenGenerator, res);
    } else if (p.mode == 'flightnet') {
      firebaseauth_flightnet_common(req, p.company, username, password, p.tokenGenerator, res);
    } else {
      res.status(400).json({message: 'invalid auth'});
    }
  } else {
    res.status(400).json({message: 'invalid auth'});
  }
}
