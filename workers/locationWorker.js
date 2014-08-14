var app = require('../app');
var secrets = app.secrets;

var locationData = {};

// Foursquare client IDs
var foursquareConfig = {
  'secrets' : {
    'clientId' : secrets.foursquare.clientId,
    'clientSecret' : secrets.foursquare.clientSecret,
    'redirectUrl' : secrets.foursquare.redirectUrl
  }
}

// Foursquare variables
var Foursquare = require('node-foursquare')(foursquareConfig);
var foursquareData = {};
var mostRecentCheckin = null;

this.locationUpdates = function(callback) {
  // Gets foursqare checkins
  Foursquare.Users.getCheckins(null, null, secrets.foursquare.accessToken, function (error, data) {

    // Pulls checkins item out of JSON response
    mostRecentCheckin = data.checkins.items[0];
    locationData = data.checkins;
    // console.log(locationData);

  callback(locationData);
  });
};