// Link back to app.js
var app = require('../app');
var secrets = app.secrets;

var request = require('superagent');

var socialData = {};

// Last.fm
var LastFmNode = require('lastfm').LastFmNode;
var lastfm = new LastFmNode({
  api_key: secrets.lastfm.apiKey,
  secret: secrets.lastfm.secret
});

// Instagram
var ig = require('instagram-node').instagram();

ig.use({
  client_id: secrets.instagram.clientId,
  client_secret: secrets.instagram.clientSecret
});

socialData.instagram = {};


// Update all social services
this.socialUpdates = function(callback) {

  // Last.fm variables
  var recentlyPlayedUrl = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks";
  var weeklyArtistUrl = "http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart";

  socialData.lastfm = {};

  // Gets recently played songs JSON
  request
    .get(recentlyPlayedUrl)
    .query({user : secrets.lastfm.user})
    .query({api_key: secrets.lastfm.apiKey})
    .query({format: "json"})
    .end(function(res){
      socialData.lastfm.recentlyPlayed = res.body.recenttracks;
    });

  // Gets most played artists this week
  request
    .get(weeklyArtistUrl)
    .query({user : secrets.lastfm.user})
    .query({api_key: secrets.lastfm.apiKey})
    .query({format: "json"})
    .end(function(res){
      socialData.lastfm.weeklyArtists = res.body.weeklyartistchart;
    });


  // Get most recent Instagram photo
  ig.user_media_recent('10965807', {'count': 1}, function(err, medias, pagination, limit) {
  socialData.instagram.lastPhoto = medias[0].images.standard_resolution.url;
  socialData.instagram.lastPhotoLikes = medias[0].likes.count;
  socialData.instagram.lastPhotoComments = medias[0].comments.count;
  socialData.instagram.lastPhotoCaption = medias[0].caption.text;
  });

  callback(socialData);

};