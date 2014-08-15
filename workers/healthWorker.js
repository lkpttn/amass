// Link back to app.js
var app = require('../app');
var secrets = app.secrets;

// Google Spreadsheet
var GoogleSpreadsheet = require('google-spreadsheet');
var weightSpreadsheet = new GoogleSpreadsheet(secrets.googleSpreadsheet.weightID);

// Jawbone
var jawboneOptions = {
  access_token:  secrets.jawbone.access_token
  //client_secret: secrets.jawbone.client_secret  // Client Secret (required for up.refreshToken.get())
}
var up = require('jawbone-up')(jawboneOptions);



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

  // Date objects
  var yesterday = new Date();
  var today = new Date();

  // Yesterday as YYYYMMDD for Jawbone API calls
  yesterday.setDate(yesterday.getDate() - 1);
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

  // Today object for meals
  var tdd = today.getDate();
  var today = yyyy + "" + mm + "" + tdd;

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
  up.sleeps.get({'date': today}, function (err, body) {
    if (err) {
      console.log('Error: ' + err);
    }
    else {
      console.log('Sleep data is loaded');
      var data = JSON.parse(body).data;
      health.jawboneSleepData = data.items[0];
    }
  });

  // Retreives meals for today
  up.meals.get({'date': today}, function (err, body) {
    if (err) {
      console.log('Error: ' + err);
    }
    else {
      console.log('Food data is loaded');
      var data = JSON.parse(body).data;
      foodData = data.items;
      lastIndex = foodData.length - 1;
      health.todayFood = {};
      todayFood = health.todayFood;

      // Latest meal
      todayFood.latestMeal = foodData[lastIndex].note;
      todayFood.latestMealCalories = foodData[lastIndex].details.calories;
      // Today's food
      todayFood.calories = null;
      todayFood.protein = null;
      todayFood.carbohydrate = null;
      todayFood.fiber = null;
      todayFood.unsaturated_fat = null;
      todayFood.saturated_fat = null;
      todayFood.sodium = null;

      for (i=0; i < foodData.length; i++) {
        todayFood.calories = todayFood.calories + foodData[i].details.calories;
        todayFood.protein = todayFood.protein + foodData[i].details.protein;
        todayFood.carbohydrate = todayFood.carbohydrate + foodData[i].details.carbohydrate;
        todayFood.fiber = todayFood.fiber + foodData[i].details.fiber;
        todayFood.unsaturated_fat = todayFood.unsaturated_fat + foodData[i].details.unsaturated_fat;
        todayFood.saturated_fat = todayFood.saturated_fat + foodData[i].details.saturated_fat;
        todayFood.sodium = todayFood.sodium + foodData[i].details.sodium;
      }
    }
  });

  callback(healthData);
};