var Forecast = require('forecast.io');

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

forecast = new Forecast(options);

places.forEach(function(place) {
  console.log('Getting forecast for ' + place.label);
  forecast.get(place.latitude, place.longitude, function(err, res, data) {
    console.log(data.currently.temperature + 'F');
    console.log(fToC(data.currently.temperature) + '°C');
  });
});

/**
 * Convert Fahrenheit to Celsius
 */
function fToC(f) {
  return ((f - 32) * 5 / 9).toFixed(2);
}
