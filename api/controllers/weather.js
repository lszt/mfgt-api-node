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

var netatmo = require('netatmo');
 
var auth = {
  "client_id": process.env.NETATMO_CLIENT_ID,
  "client_secret": process.env.NETATMO_CLIENT_SECRET,
  "username": process.env.NETATMO_USERNAME,
  "password": process.env.NETATMO_PASSWORD,
};

var NETATMO_DEVICE_ID = process.env.NETATMO_DEVICE_ID;
 
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
  info: info,
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */


function addToResult(out, dd) {
  var valFilter = function(val) {
    var FILTER = ['Temperature', 'Humidity', 'WindAngle', 'WindStrength', 'GustAngle', 'GustStrength', 'Pressure'];
    if (FILTER.indexOf(val) > -1) {
      out[val] = dd[val];
    }
  }
  if (dd != undefined) {
    Object.keys(dd).map(valFilter);
  }
}

function info(req, res) {
  var api = new netatmo(auth);
  api.getStationsData(function(err, devices) {
    console.log(devices);
    if (err || devices === undefined) { 
      res.json({});
    } else if (devices[0].dashboard_data) {
      var out = {};
      var last_update = devices[0].dashboard_data.time_utc * 1000;
      out.last_update = new Date(last_update).toISOString();
      out.last_update_age = new Date().getTime() - last_update;
      addToResult(out, devices[0].dashboard_data);
      var mods = devices[0].modules;
      for (var m in mods) {
        var dd = mods[m].dashboard_data;
        addToResult(out, dd);
      };
      res.json(out);
    } else {
      res.json({});
    }
  });
}
