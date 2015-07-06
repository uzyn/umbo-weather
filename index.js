var async = require('async');
var Forecast = require('forecast.io');
var request = require('request');

try {
  var places = require('./places.json');
} catch (e) {
  console.error(e);
  console.log('places.json is missing.');
  return process.exit(1);
}

var options = {
  APIKey: process.env.FORECAST_API_KEY
}
var umboUrl = process.env.UMBO_URL || 'http://umbo.zynesis.com/';

forecast = new Forecast(options);

async.eachLimit(places, 4, function(place, callback) {
  console.log('Getting forecast for ' + place.label);
  forecast.get(place.latitude, place.longitude, function(err, res, data) {
    console.log(place.label + ': ' + data.currently.temperature + 'F');
    console.log(place.label + ': ' + fToC(data.currently.temperature) + '°C');

    request.post({
      url: umboUrl + place.umboID,
      form: {
        token: place.umboKey,
        value: fToC(data.currently.temperature)
      }
    }, function (err, httpResponse, body) {
      if (err) {
        console.log('Error');
        console.log(body);
        return;
      }
      console.log(body);
      callback();
    });
  });
});

/**
 * Convert Fahrenheit to Celsius
 */
function fToC(f) {
  return ((f - 32) * 5 / 9).toFixed(2);
}
