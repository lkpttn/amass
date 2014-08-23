// Link back to app.js
var app = require('../app');
var secrets = app.secrets;

// locationData object to be passed in callback function
var locationData = {};
locationData.foursquare = {};

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
  Foursquare.Users.getCheckins(null, {'limit':100}, secrets.foursquare.accessToken, function (error, data) {

    // Pulls checkins item out of JSON response
    mostRecentCheckin = data.checkins.items[0];
    locationData.foursquare.checkins = data.checkins;
  });

  Foursquare.Users.getVenueHistory(null,{'categoryId': '4d4b7105d754a06374d81259'}, secrets.foursquare.accessToken, function (error, data) {
    // Gets food category venue history
    location.foursquare.foodHistory = data;
  })

  Foursquare.Users.getVenueHistory(null,{'categoryId': '4d4b7104d754a06370d81259'}, secrets.foursquare.accessToken, function (error, data) {
    // Gets entertainment category venue history
    location.foursquare.entertainmentHistory = data;
  })

  Foursquare.Users.getVenueHistory(null,{'categoryId': '4d4b7105d754a06379d81259'}, secrets.foursquare.accessToken, function (error, data) {
    // Gets travel category venue history
    location.foursquare.travelHistory = data;
  })


  callback(locationData);
};