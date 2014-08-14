// CONFIG
// Server and express variables
var express = require('express');
var app = express();

// Big objects
var health = {};
var location = {};
var social = {};

this.secrets = require(__dirname + '/secrets/secrets.json');
var secrets = this.secrets;

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

// Google Spreadsheet variables
var GoogleSpreadsheet = require('google-spreadsheet');
var weightSpreadsheet = new GoogleSpreadsheet(secrets.googleSpreadsheet.weightID);
var mealsSpreadsheet = new GoogleSpreadsheet(secrets.googleSpreadsheet.mealsID);

// Last.fm variables
var LastFmNode = require('lastfm').LastFmNode;

var lastfm = new LastFmNode({
  api_key: secrets.lastfm.apiKey,
  secret: secrets.lastfm.secret
});

// Gets weight from google spreadsheet
weightSpreadsheet.getInfo( function (err, sheet_info) {
  console.log( sheet_info.title + ' is loaded' );
  sheet_info.worksheets[0].getRows( function(err, rows) {

    // Variable for the latest measurement
    var latestDay = rows.length - 1;
    // // Array to hold the past week
    var pastWeekWeight = [];

    // Load last 7 days into an array
    for (i = 0; i < 7; i++) {
      var pastDay = latestDay - i;
      pastWeekWeight[i] = rows[pastDay].weight + ' lbs';
      // console.log(rows[pastDay.date + ' : ' + rows[pastDay].weight + 'lbs');
    };

    health.weight = rows[latestDay].weight;
    health.bodyFat = rows[latestDay].fat;
    health.pastWeekWeight = pastWeekWeight.reverse();
  });
});

// Gets meals from google spreadsheet
mealsSpreadsheet.getInfo( function (err, sheet_info) {
  console.log( sheet_info.title + ' is loaded' );
  sheet_info.worksheets[0].getRows( function(err, rows) {

    // Variable for the latest measurement
    var latestMeal = rows.length - 1;

    health.latestMeal = rows[latestMeal].description;
    health.latestMealCalories = rows[latestMeal].calories;
  });
});

// Get Last.fm recent tracks
var trackStream = lastfm.stream('inscien');

trackStream.on('lastPlayed', function(track) {
  social.lastPlayed = track;
});

trackStream.start();

// IDK
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  // Spit out most recent foursquare checkin
  res.sendfile('index.html');
});

app.get('/foursquare', function(req, res) {
  Foursquare.Users.getCheckins(null, null, secrets.foursquare.accessToken, function (error, data) {
    // Pulls checkins item out of JSON response
    foursquareData = data.checkins;
    res.json(foursquareData);
  });
});

app.get('/health', function(req, res) {
  res.json(health);
});

app.get('/social', function(req, res) {
  res.json(social);
});

// Set up express server on port 3000
var server = app.listen(3000, function () {
  console.log('Listening on port %d', server.address().port);
});