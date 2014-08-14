// CONFIG
// Server and express variables
var express = require('express');
var app = express();

// Big objects
health = {};
location = {};
social = {};


this.secrets = require(__dirname + '/secrets/secrets.json');
var secrets = this.secrets;

var googleSpreadsheetWorker = require(__dirname + '/workers/googleSpreadsheetWorker');
var locationWorker = require(__dirname + '/workers/locationWorker');
var socialWorker = require(__dirname + '/workers/socialWorker');

// Workers gathering information
// Update google spreadsheet data and move into health object
googleSpreadsheetWorker.googleSpreadsheetUpdates(function (healthData) {
  health = healthData;
});

// Update location data and move into location object
locationWorker.locationUpdates(function (locationData) {
  location = locationData;
})

// Update social data and move into social object
socialWorker.socialUpdates(function (socialData) {
  social = socialData;
});



// IDK
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  // Send the index file
  res.sendfile('index.html');
});

app.get('/health', function(req, res) {
    res.json(health);
});

app.get('/location', function(req, res) {
    res.json(location);
});

app.get('/social', function(req, res) {
    res.json(social);
});

// Set up express server on port 3000
var server = app.listen(3000, function () {
  console.log('Listening on port %d', server.address().port);
});