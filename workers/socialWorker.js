// Link back to app.js
var app = require('../app');
var secrets = app.secrets;

// socialData object to be passed in callback function
var socialData = {};

// Specfic requirements and variables
var LastFmNode = require('lastfm').LastFmNode;

var lastfm = new LastFmNode({
  api_key: secrets.lastfm.apiKey,
  secret: secrets.lastfm.secret
});

// Update all social services
this.socialUpdates = function(callback) {

  // Get Last.fm recent tracks
  var trackStream = lastfm.stream('inscien');

  trackStream.on('lastPlayed', function(track) {
    socialData.lastPlayed = track;
    console.log('Last.fm data loaded');
  });

  trackStream.start();

  callback(socialData);
};