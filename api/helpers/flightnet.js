'use strict';

var debug = require('debug')('helpers');

module.exports = {
  passwordCheck: passwordCheck,
};

var soap = require('soap');
var wsdl = "https://www.flightnet.aero/APIWS/ReservationService.svc?wsdl";

function passwordCheck(company, username, password, callback) {
  var args = {
    'company':  company,
    'username': username,
    'password': password,
  };
console.log(args);
  soap.createClient(wsdl, function(err, client) {
    client.GetAPIKey(args, function(err, result) {
      if (err) {
        if (callback) callback(false);
        return;
      }

      var apiKey = result.GetAPIKeyResult;
      if (apiKey) {
        if (callback) callback(true);
      } else {
        if (callback) callback(false);
      }
//      var args = {apiKey: apiKey};
//      client.GetUsers(args, function(err, result) {
//        console.log(JSON.stringify(result));
//      });
    });
  });
};
