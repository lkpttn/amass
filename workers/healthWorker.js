// Link back to app.js
var app = require('../app');
var secrets = app.secrets;

// Specfic requirements and variables
var GoogleSpreadsheet = require('google-spreadsheet');
var weightSpreadsheet = new GoogleSpreadsheet(secrets.googleSpreadsheet.weightID);
var mealsSpreadsheet = new GoogleSpreadsheet(secrets.googleSpreadsheet.mealsID);

var jawboneOptions = {
  // ** REQUIRED **
  access_token:  secrets.jawbone.access_token  // Access token for specific user,
  //client_secret: secrets.jawbone.client_secret  // Client Secret (required for up.refreshToken.get())
}

var up = require('jawbone-up')(jawboneOptions);

// healthData object to be passed in callback function
var healthData = {};

this.healthUpdates = function(callback) {

  // Gets weight from google spreadsheet
  weightSpreadsheet.getInfo( function (err, sheet_info) {
    console.log( sheet_info.title + ' data is loaded' );
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

      healthData.weight = rows[latestDay].weight;
      healthData.bodyFat = rows[latestDay].fat;
      healthData.pastWeekWeight = pastWeekWeight.reverse();

    });
  });

  // Gets meals from google spreadsheet
  mealsSpreadsheet.getInfo( function (err, sheet_info) {
    console.log( sheet_info.title + ' is loaded' );
    sheet_info.worksheets[0].getRows( function(err, rows) {

      // Variable for the latest measurement
      var latestMeal = rows.length - 1;

      healthData.latestMeal = rows[latestMeal].description;
      healthData.latestMealCalories = rows[latestMeal].calories;
    });
  });

  // Get yesterday Date object
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  // Yesterday as YYYYMMDD for Jawbone API calls
  var yyyy = yesterday.getFullYear();
  var mm = yesterday.getMonth() + 1;
  if (mm < 10) {
    mm = 0 + "" + mm;
  }
  var dd = yesterday.getDate();
  if (dd < 10) {
    dd = 0 + "" + dd;
  }
  yesterday = yyyy + "" + mm + "" + dd;

  // Retreives physical activity for yesterday
  up.moves.get({'date': yesterday}, function (err, body) {
    if (err) {
      console.log('Error: ' + err);
    }
    else {
      console.log('Movement data is loaded')
      var data = JSON.parse(body).data;
      health.jawboneMoveData = data.items[0];
    }
  });

  // Retreives sleep activity for last night
  up.sleeps.get({'date': yesterday}, function (err, body) {
    if (err) {
      console.log('Error: ' + err);
    }
    else {
      console.log('Sleep data is loaded')
      var data = JSON.parse(body).data;
      health.jawboneSleepData = data.items[0];
    }
  });

  callback(healthData);
};