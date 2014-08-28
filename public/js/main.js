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

        // For getting day of the week
        var weekday=new Array(7);
        weekday[0]="Monday";
        weekday[1]="Tuesday";
        weekday[2]="Wednesday";
        weekday[3]="Thursday";
        weekday[4]="Friday";
        weekday[5]="Saturday";
        weekday[6]="Sunday";

        // Body
        $('.age').text(age.toFixed(1));
        $('.weight').text(healthData.weight + ' lb');
        $('.bodyFat').text(healthData.bodyFat + '%');

        var weightChartData = {
        labels : ["","","","","","", ""],
        datasets : [
          {
            label: "My First dataset",
            fillColor : "rgba(245, 89, 73, 0.2)",
            strokeColor : "rgba(245, 89, 73, 0.5)",
            pointColor : "#f55949",
            pointStrokeColor : "#f55949",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(220,220,220,1)",
            data : healthData.pastWeekWeight
            }
          ]
        }

        var drawChart = function(){
          var ctx = document.getElementById("weightChart").getContext("2d");
          window.myLine = new Chart(ctx).Line(weightChartData, {
            responsive: true,
            showTooltips: false,
            scaleOverride: true,
            // Number - The number of steps in a hard coded scale
            scaleSteps: 5,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: 1,
            // Number - The scale starting value
            scaleStartValue: 150
          });
        }

        drawChart();



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

        var activityTotal = [];
        var keysArray = Object.keys(healthData.jawboneMoveData.details.hourly_totals);
        var activityTotalSteps = null;

        for (i = 0; i < keysArray.length; i++) {
          var temp = keysArray[i];
          var tempItem = jawboneMoves.hourly_totals[temp];
          activityTotalSteps = activityTotalSteps + tempItem.steps;
          activityTotal[i] = activityTotalSteps;
        }

        var activityChartData = {
        labels : activityTotal,
        datasets : [
          {
            label: "My First dataset",
            fillColor : "rgba(245, 89, 73, 0.2)",
            strokeColor : "rgba(245, 89, 73, 0.5)",
            pointColor : "#f55949",
            pointStrokeColor : "#f55949",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(220,220,220,1)",
            data : activityTotal
            }
          ]
        }

        var drawChart = function(){
          var ctx = document.getElementById("activityChart").getContext("2d");
          window.myLine = new Chart(ctx).Line(activityChartData, {
            responsive: true,
            showTooltips: true,
            pointDot: false,
            scaleOverride: true,
            // Number - The number of steps in a hard coded scale
            scaleSteps: 5,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: 2000,
            // Number - The scale starting value
            scaleStartValue: 0
          });
        }

        drawChart();

        // Running
        var runkeeperRun = healthData.runkeeper.latestRun;
        var startRunDate = new Date(runkeeperRun.start_time);
        var startRun = startRunDate.toDateString().slice(0,-4);
        $('.latestRunTime').text(startRun);
        $('.latestRunDistance').text((runkeeperRun.total_distance*0.000621371).toFixed(2) + ' mi');
        $('.latestRunDuration').text(
          (Math.floor(runkeeperRun.duration/60) + "m " // Minutes
          + Math.round(runkeeperRun.duration % 60) + "s") // Seconds
        );

        // Running map
        L.mapbox.accessToken = 'pk.eyJ1IjoibGtwdHRuIiwiYSI6InNXMnVtRjAifQ.5U8rLs-7oktv8HotJCvrcQ';
        map_options = {
          touchZoom: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          tap: false,
          zoomControl: false,
          attributionControl: false
        };
        var runMap = L.mapbox.map('runMap', 'lkpttn.jabob21n', map_options)

        // Load latest run path
        var runArray = runkeeperRun.path;
        // Line style
        var polyline_options = {
            color: '#f55949',
            weight: 7,
            opacity: 1.0,
            smoothFactor: 1.0
        };
        var polyline = L.polyline([], polyline_options).addTo(runMap);
        var length = 0;

        add();

        function add() {
          var temp = L.latLng(runArray[length].latitude, runArray[length].longitude);
          polyline.addLatLng(temp);
          runMap.setView(temp, 16);

          if (++length < runArray.length) window.setTimeout(add, 40);
        };

        // Sleep
        var sleeping = "I'm probably asleep right now!";
        // If there's no sleep data available
        if (typeof healthData.jawboneSleepData === "undefined") {
          $('.yesterdaySleep').text(sleeping);
          $('.deepSleep').text('~');
          $('.lightSleep').text('~');
        } else {
          var jawboneSleep = healthData.jawboneSleepData[0].details;
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

        var sleepArray = [];
        var daysArray = [];
        for (i = 0; i < 7; i++) {
          var temp = ((healthData.jawboneSleepData[i].details.duration - healthData.jawboneSleepData[i].details.awake)/60/60).toFixed(1);
          sleepArray.unshift(temp);
          var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
          d.setUTCSeconds(healthData.jawboneSleepData[i].time_created);
          daysArray.unshift(weekday[d.getDay()].slice(0,3));
        }

        console.log(sleepArray);
        console.log(daysArray);

        var sleepChartData = {
        labels : daysArray,
        datasets : [
          {
            label: "My First dataset",
            fillColor : "rgba(245, 89, 73, 1)",
            strokeColor : "rgba(245, 89, 73, 1)",
            pointColor : "#f55949",
            pointStrokeColor : "#f55949",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(220,220,220,1)",
            data : sleepArray
            }
          ]
        }

        var drawChart = function(){
          var ctx = document.getElementById("sleepChart").getContext("2d");
          window.myLine = new Chart(ctx).Bar(sleepChartData, {
            responsive: true,
            showTooltips: true,
            scaleOverride: true,
            // Number - The number of steps in a hard coded scale
            scaleSteps: 5,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: 1,
            // Number - The scale starting value
            scaleStartValue: 5
          });
        }

        drawChart();

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

        // Place map
        L.mapbox.accessToken = 'pk.eyJ1IjoibGtwdHRuIiwiYSI6InNXMnVtRjAifQ.5U8rLs-7oktv8HotJCvrcQ';
        map_options = {
          touchZoom: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          tap: false,
          zoomControl: false,
          attributionControl: false
        };
        var placeMap = L.mapbox.map('placeMap', 'lkpttn.jaco7c8l', map_options);
        var foursquarePlaces = L.layerGroup().addTo(placeMap);

        // Load places
        var placeArray = locationData.foursquare.checkins.items;

        for (var i = 0; i < placeArray.length; i++) {
        var venue = placeArray[i].venue;
        var latlng = L.latLng(placeArray[i].venue.location.lat, placeArray[i].venue.location.lng);
        var circle = L.circle(latlng, 300, {
          stroke: false,
          fillColor: '#47b3e6',
          fillOpacity: 0.4
          }).addTo(foursquarePlaces);
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