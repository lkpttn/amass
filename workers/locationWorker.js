// Link back to app.js
var app = require('../app');
var secrets = app.secrets;

// locationData object to be passed in callback function
var locationData = {};

// Specfic requirements and variables
var foursquareConfig = {
  'secrets' : {
    'clientId' : secrets.foursquare.clientId,
    'clientSecret' : secrets.foursquare.clientSecret,
    'redirectUrl' : secrets.foursquare.redirectUrl
  }
}

var Foursquare = require('node-foursquare')(foursquareConfig);
var foursquareData = {};
var mostRecentCheckin = null;

// Update all location services
this.locationUpdates = function(callback) {
  // Gets foursqare checkins
  Foursquare.Users.getCheckins(null, null, secrets.foursquare.accessToken, function (error, data) {

    // Pulls checkins item out of JSON response
    mostRecentCheckin = data.checkins.items[0];
    locationData.foursquare = data.checkins;
    // console.log(locationData);

  callback(locationData.foursquare);
  });
};