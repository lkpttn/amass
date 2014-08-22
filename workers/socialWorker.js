// Link back to app.js
var app = require('../app');
var secrets = app.secrets;

var request = require('superagent');

var socialData = {};

// Twitter
var twitterAPI = require('node-twitter-api');

var twitter = new twitterAPI({
    consumerKey: secrets.twitter.consumerKey,
    consumerSecret: secrets.twitter.consumerSecret
});

socialData.twitter = {};

// Instagram
var ig = require('instagram-node').instagram();

ig.use({
  client_id: secrets.instagram.clientId,
  client_secret: secrets.instagram.clientSecret
});

socialData.instagram = {};


// Update all social services
this.socialUpdates = function(callback) {

  // Twitter
  twitter.users("show", {'screen_name' : 'friendofpixels'}, secrets.twitter.accessToken, secrets.twitter.accessTokenSecret, function(error, data, response) {
    if (error) {
        console.log(error);
    } else {
        console.log('Twitter data is loaded');
        socialData.twitter = data;
    }
  });

  // Last.fm variables
  var recentlyPlayedUrl = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks";
  var weeklyArtistUrl = "http://ws.audioscrobbler.com/2.0/?method=user.gettopartists";
  var userUrl = "http://ws.audioscrobbler.com/2.0/?method=user.getinfo";
  var artistsUrl = "http://ws.audioscrobbler.com/2.0/?method=user.gettopartists";

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
    .query({period: '7day'})
    .end(function(res){
      socialData.lastfm.weeklyArtists = res.body.topartists.artist;
    });

  // Gets user information
  request
    .get(userUrl)
    .query({user : secrets.lastfm.user})
    .query({api_key: secrets.lastfm.apiKey})
    .query({format: "json"})
    .end(function(res){
      socialData.lastfm.user = res.body.user;
    });

  // Gets all artists
  request
    .get(artistsUrl)
    .query({user : secrets.lastfm.user})
    .query({api_key: secrets.lastfm.apiKey})
    .query({format: "json"})
    .query({period: 'overall'})
    .end(function(res){
      socialData.lastfm.artists = res.body.topartists['@attr'];
    });

  console.log('Last.fm data is loaded');

  // Get most recent Instagram photo
  ig.user_media_recent('10965807', {'count': 1}, function(err, medias, pagination, limit) {
  socialData.instagram.lastPhoto = medias[0].images.standard_resolution.url;
  socialData.instagram.lastPhotoLikes = medias[0].likes.count;
  socialData.instagram.lastPhotoComments = medias[0].comments.count;
  });

  ig.user('10965807', function(err, result, limit) {
    socialData.instagram.counts = result.counts;
    console.log('Instagram data is loaded');
  });

  callback(socialData);

};