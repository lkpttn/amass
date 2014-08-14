// Link back to app.js
var app = require('../app');
var secrets = app.secrets;

// Specfic requirements and variables
var GoogleSpreadsheet = require('google-spreadsheet');
var weightSpreadsheet = new GoogleSpreadsheet(secrets.googleSpreadsheet.weightID);
var mealsSpreadsheet = new GoogleSpreadsheet(secrets.googleSpreadsheet.mealsID);

// healthData object to be passed in callback function
var healthData = {};

this.healthUpdates = function(callback) {

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

  callback(healthData);
};