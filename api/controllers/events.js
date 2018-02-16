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

module.exports = {
  events: events,
};

function events(req, res) {
  res.json([{
            "From": "2017-10-26T17:00:00+02:00",
            "Until": "2018-12-31T17:00:00+02:00",
            "Description": "Kommentar, blabla\nblabbla\nasdfddsaf",
        },{
            "From": "2017-11-26T17:00:00+02:00",
            "Until": "2018-11-31T17:00:00+02:00",
            "Description": "Yet another event\nblabbla\nasdfddsaf",
        }]);
}
