$(function() {

  var updateHealth = function() {
    $.ajax('/health', {
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        var healthData = data;

        // Get age - time elapsed
        var birthday = new Date(1992, 5, 19, 0, 0); // June 19, 1992
        var now = new Date();
        var age = now.getTime() - birthday.getTime();
        age = age/(1000*60*60*24*365);

        // Body
        $('.age').text(age.toFixed(1));
        $('.weight').text(healthData.weight + ' lb');
        $('.bodyFat').text(healthData.bodyFat + '%');

        // Food
        $('.latestMeal').text(healthData.todayFood.latestMeal);
        $('.calories').text(healthData.todayFood.latestMealCalories.toFixed(1));

        // Today Food
        $('.todayCalories').text(healthData.todayFood.calories.toFixed(1));
        $('.todayProtein').text(healthData.todayFood.protein.toFixed(0) + 'g');
        $('.todayCarbs').text(healthData.todayFood.carbohydrate.toFixed(1) + 'g');
        $('.todayFiber').text(healthData.todayFood.fiber.toFixed(0) + 'g');
        $('.todayUnsatFat').text(healthData.todayFood.unsaturated_fat.toFixed(1) + 'g');
        $('.todaySatFat').text(healthData.todayFood.saturated_fat.toFixed(1) + 'g');
        $('.todaySodium').text(healthData.todayFood.sodium.toFixed(0) + '');

        // Today Food Percent
        $('.todayProteinPercent').text((healthData.todayFood.protein/80*100).toFixed(0) + '%');
        $('.todayCarbsPercent').text((healthData.todayFood.carbohydrate/140*100).toFixed(0) + '%');
        $('.todayFiberPercent').text((healthData.todayFood.fiber/40*100).toFixed(0) + '%');
        $('.todayUnsatFatPercent').text((healthData.todayFood.unsaturated_fat/40*100).toFixed(0) + '%');
        $('.todaySatFatPercent').text((healthData.todayFood.saturated_fat/20*100).toFixed(0) + '%');
        $('.todaySodiumPercent').text((healthData.todayFood.sodium/2300*100).toFixed(0) + '%');

        // Activity
        var jawboneMoves = healthData.jawboneMoveData.details;
        $('.yesterdaySteps').text(jawboneMoves.steps);
        $('.milesWalked').text((jawboneMoves.distance/1609.344).toFixed(1) + " mi");
        $('.caloriedBurned').text((jawboneMoves.calories).toFixed(0));
        $('.activeTime').text(
          Math.floor(jawboneMoves.active_time/60/60) + "h " // Hours
          + Math.round(jawboneMoves.active_time/60 % 60) + "m" // Minutes remaining
          );
         $('.inactiveTime').text(
          Math.floor(jawboneMoves.inactive_time/60/60) + "h " // Hours
          + Math.round(jawboneMoves.inactive_time/60 % 60) + "m" // Minutes remaining
          );

        // Sleep
        var sleeping = "I'm probably asleep right now!";
        // If there's no sleep data available
        if (typeof healthData.jawboneSleepData === "undefined") {
          $('.yesterdaySleep').text(sleeping);
          $('.deepSleep').text('~');
          $('.lightSleep').text('~');
        } else {
          var jawboneSleep = healthData.jawboneSleepData.details;
         $('.yesterdaySleep').text(
          Math.floor((jawboneSleep.duration - jawboneSleep.awake)/60/60) + "h " // Hours
          + Math.round((jawboneSleep.duration- jawboneSleep.awake)/60 % 60) + "m" // Minutes remaining
          );
         $('.deepSleep').text(
          Math.floor(jawboneSleep.sound/60/60) + "h " // Hours
          + Math.round(jawboneSleep.sound/60 % 60) + "m" // Minutes remaining
          );
         $('.lightSleep').text(
          Math.floor(jawboneSleep.light/60/60) + "h " // Hours
          + Math.round(jawboneSleep.light/60 % 60) + "m" // Minutes remaining
          );
        }
      }
    });
  };

  updateHealth();

  var updateLocation = function() {
    $.ajax('/location', {
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        var locationData = data;
        var mostRecentCheckin = locationData.foursquare.checkins.items[0];

        // Time of most recent checkin
        var checkinDate = new Date(mostRecentCheckin.createdAt*1000);
        var hours = checkinDate.getHours();
        var minutes = checkinDate.getMinutes();

        // Most recent checkin
        $('.latestCheckin').text(mostRecentCheckin.venue.name);
        $('.time').text(hours + ':' + minutes);

        // Loop for last 4 checkins
        for (i = 1; i < 5; i++) {
          var tempCheckin = locationData.foursquare.checkins.items[i];
          $('.foursquareRecent'+i).text(tempCheckin.venue.name);
        }

        // Food venue checkins
        var foodHistory = locationData.foursquare.foodHistory.venues.items;
        var foodList = '';
        for (i = 0; i < foodHistory.length; i++) {
          foodList += locationData.foursquare.foodHistory.venues.items[i].venue.name + ", ";
        }
        foodList = foodList.slice(0, -2);
        $('.foodVenuePlace').text(foodList);

        // Entertainment venue checkins
        var entertainmentHistory = locationData.foursquare.entertainmentHistory.venues.items;
        var entertainmentList = '';
        for (i = 0; i < entertainmentHistory.length; i++) {
          entertainmentList += locationData.foursquare.entertainmentHistory.venues.items[i].venue.name + ", ";
        }
        entertainmentList = entertainmentList.slice(0, -2);
        $('.entertainmentVenuePlace').text(entertainmentList);

        // travel venue checkins
        var travelHistory = locationData.foursquare.travelHistory.venues.items;
        var travelList = '';
        for (i = 0; i < travelHistory.length; i++) {
          travelList += locationData.foursquare.travelHistory.venues.items[i].venue.name + ", ";
        }
        travelList = travelList.slice(0, -2);
        $('.travelVenuePlace').text(travelList);

      }
    });
  };

  updateLocation();

  var updateSocial = function() {
    $.ajax('/social', {
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        var socialData = data;

        var twitter = socialData.twitter;

        // Twitter most recent status
        $('.latestTweet').text(twitter.status.text);

        // Twitter stats
        $('.twitterTweets').text(twitter.statuses_count);
        $('.twitterFollowers').text(twitter.followers_count);
        $('.twitterFollowing').text(twitter.friends_count);

        var lastfm = socialData.lastfm;

        // Hack around Last.fm JSON including a #text
        var recentlyPlayedArtist = lastfm.recentlyPlayed.track[0].artist['#text'];
        var recentlyPlayedAlbumArt = lastfm.recentlyPlayed.track[0].image[3]['#text'];


        // Last.fm
        $('.lastPlayed').text(lastfm.recentlyPlayed.track[0].name);
        $('.lastPlayedArtist').text(recentlyPlayedArtist);
        document.getElementById('lastPlayedAlbumArt').setAttribute('src', recentlyPlayedAlbumArt);

        for (i = 0; i < 5; i++) {
          var topArtist = lastfm.weeklyArtists[i];
          $('.topArtist'+i).text(topArtist.name);
          $('.playcount'+i).text(topArtist.playcount);
        }

        $('.totalPlaycount').text(lastfm.user.playcount);
        $('.totalArtists').text(lastfm.artists.total);

        // Instagram
        document.getElementById('lastPhoto').setAttribute('src', socialData.instagram.lastPhoto);
        $('.lastPhotoCaption').text(socialData.instagram.lastPhotoCaption);
        $('.lastPhotoLikes').text(socialData.instagram.lastPhotoLikes);
        $('.lastPhotoComments').text(socialData.instagram.lastPhotoComments);

        $('.photoCount').text(socialData.instagram.counts.media);
        $('.followerCount').text(socialData.instagram.counts.followed_by);
        $('.followingCount').text(socialData.instagram.counts.follows);
      }
    });
  };

  updateSocial();
});