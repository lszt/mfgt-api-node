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
  flights: flights,
};

function flights(req, res) {
  res.json([{
            "FlightDirection": "inbound", // Symbol
            "Registration": "HB-PGM",     // Flugzeug
            "AircraftType": "PA28",       // Flugzeug
            "DateOfFlight":"2017-10-26T17:00:00+02:00", // Zeit
            "Location":"LSZR",            // Von/Nach

            "Pilot":"MFGT Sekretariat",   // Pilot
        },{
            "FlightDirection": "outbound",
            "Registration": "HB-PGM",
            "AircraftType": "PA28",
            "TakeOff":"2017-10-25T11:00:00+02:00",
            "Destination":"LSZR",

            "DateOfFlight":"2017-10-26T19:00:00+02:00",
            "Location":"LSZR",

            "Pilot":"MFGT Sekretariat",
        }]);
}
