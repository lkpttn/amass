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
        $('.weight').text(healthData.weight + 'lbs');
        $('.bodyFat').text(healthData.bodyFat + '%');

        // Food
        $('.latestMeal').text(healthData.latestMeal);
        $('.calories').text(healthData.latestMealCalories);
      }
    });
  };

  updateHealth();

  var updateFoursquare = function() {
    $.ajax('/foursquare', {
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        var foursquareData = data;
        var mostRecentCheckin = data.items[0];

        // Time of most recent checkin
        var checkinDate = new Date(mostRecentCheckin.createdAt*1000);
        var hours = checkinDate.getHours();
        var minutes = checkinDate.getMinutes();

        // Most recent checkin
        $('.latestCheckin').text(mostRecentCheckin.venue.name).css('color','blue');
        $('.time').text(hours + ':' + minutes);

        // Loop for last 4 checkins
        for (i = 1; i < 5; i++) {
          var tempCheckin = foursquareData.items[i];
          $('.foursquareRecent'+i).text(tempCheckin.venue.name);
        }
      }
    });
  };

  updateFoursquare();

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
      }
    });
  };

  updateSocial();
});