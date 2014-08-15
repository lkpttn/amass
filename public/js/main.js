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
        $('.age').text(age.toFixed(2) + ' years');
        $('.weight').text(healthData.weight + ' lbs');
        $('.bodyFat').text(healthData.bodyFat + '%');

        // Food
        $('.latestMeal').text(healthData.todayFood.latestMeal);
        $('.calories').text(healthData.todayFood.latestMealCalories);

        // Today Food
        $('.todayCalories').text(healthData.todayFood.calories);
        $('.todayProtein').text(healthData.todayFood.protein + 'g');
        $('.todayCarbs').text(healthData.todayFood.carbohydrate + 'g');
        $('.todayFiber').text(healthData.todayFood.fiber + 'g');
        $('.todayUnsatFat').text(healthData.todayFood.unsaturated_fat + 'g');
        $('.todaySatFat').text(healthData.todayFood.saturated_fat + 'g');
        $('.todaySodium').text(healthData.todayFood.sodium + 'mg');

        // Activity
        var jawboneMoves = healthData.jawboneMoveData.details;
        $('.yesterdaySteps').text(jawboneMoves.steps);
        $('.milesWalked').text((jawboneMoves.distance/1609.344).toFixed(2) + " miles");
        $('.caloriedBurned').text((jawboneMoves.calories).toFixed(0));
        $('.activeTime').text(
          Math.floor(jawboneMoves.active_time/60/60) + " hours " // Hours
          + Math.round(jawboneMoves.active_time/60 % 60) + " minutes" // Minutes remaining
          );
         $('.inactiveTime').text(
          Math.floor(jawboneMoves.inactive_time/60/60) + " hours " // Hours
          + Math.round(jawboneMoves.inactive_time/60 % 60) + " minutes" // Minutes remaining
          );

        // Sleep
        var jawboneSleep = healthData.jawboneSleepData.details;
         $('.yesterdaySleep').text(
          Math.floor((jawboneSleep.duration - jawboneSleep.awake)/60/60) + " hours " // Hours
          + Math.round((jawboneSleep.duration- jawboneSleep.awake)/60 % 60) + " minutes" // Minutes remaining
          );
         $('.deepSleep').text(
          Math.floor(jawboneSleep.sound/60/60) + " hours " // Hours
          + Math.round(jawboneSleep.sound/60 % 60) + " minutes" // Minutes remaining
          );
         $('.lightSleep').text(
          Math.floor(jawboneSleep.light/60/60) + " hours " // Hours
          + Math.round(jawboneSleep.light/60 % 60) + " minutes" // Minutes remaining
          );
      }
    });
  };

  updateHealth();

  var updateLocation = function() {
    $.ajax('/location', {
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        var location = data;
        var mostRecentCheckin = data.items[0];

        // Time of most recent checkin
        var checkinDate = new Date(mostRecentCheckin.createdAt*1000);
        var hours = checkinDate.getHours();
        var minutes = checkinDate.getMinutes();

        // Most recent checkin
        $('.latestCheckin').text(mostRecentCheckin.venue.name).css('color','#47b3e6');
        $('.time').text(hours + ':' + minutes);

        // Loop for last 4 checkins
        for (i = 1; i < 5; i++) {
          var tempCheckin = location.items[i];
          $('.foursquareRecent'+i).text(tempCheckin.venue.name);
        }
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

        // Hack around Last.fm JSON including a #text
        var lastPlayedArtist = socialData.lastPlayed.artist['#text'];

        // Last.fm
        $('.lastPlayed').text(socialData.lastPlayed.name);
        $('.lastPlayedArtist').text(lastPlayedArtist);

        // Instagram
        document.getElementById('lastPhoto').setAttribute('src', socialData.instagram.lastPhoto);
        $('.lastPhotoCaption').text(socialData.instagram.lastPhotoCaption);
        $('.lastPhotoLikes').text(socialData.instagram.lastPhotoLikes);
        $('.lastPhotoComments').text(socialData.instagram.lastPhotoComments);
      }
    });
  };

  updateSocial();
});