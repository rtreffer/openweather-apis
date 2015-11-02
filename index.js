// weather.js - APIs for openweathermap.org
(function(){

  var config = {
    city : 'Fairplay',
    units : 'metric',
    lan : 'it',
    format : 'json',
    APPID : null,

  };


  // main settings
  var http = require('http');
  var options = {
    host : 'api.openweathermap.org',
    path: '/data/2.5/weather?q=fairplay'
  };


  // exports(set)  --------------------------------------------  exports(set)  ---------------------------------------------
  exports.setLang = function(lang){
    config.lan = lang.toLowerCase();
  }

  exports.setCity = function(city){
    config.city = encodeURIComponent(city.toLowerCase());
  }

  exports.setUnits = function(units){
    config.units = units.toLowerCase();
  }

  exports.setAPPID = function(appid){
    config.APPID = appid;
  }

  // export(get)  ---------------------------------------------  exports(get)  ---------------------------------------------
  exports.getLang = function(){
    return config.lan;
  }

  exports.getCity = function(){
    return config.city;
  }

  exports.getUnits = function(){
    return config.units;
  }

  exports.getFormat = function(){
    return config.format;
  }

  exports.getError = function(callback){
     getErr(callback);
  }

  exports.getAPPID = function(){
    return config.APPID;
  }


  // get Response by field (satusCode, )
  exports.getResponseCode = function(callback){
    getResponseBF('statusCode', callback);
  }

  // get temperature
  exports.getTemperature = function(callback){
    getTemp(callback);
  }

  // get the atmospheric pressure
  exports.getPressure = function(callback){
    getPres(callback);
  }

  exports.getHumidity = function(callback){
    getHum(callback);
  }

  exports.getDescription = function(callback){
    getDesc(callback);
  }

  exports.getAllWeather = function(callback){
    getData(callback);
  }

  exports.getSmartJSON = function(callback){
    getSmart(callback);
  }

  // active functions()  -------------------------------------  active functions()  --------------------------------------------

  function getErr(callback){
    // set new path to throw the http exception
    options.path = 'timetocrash';
    var request = http.get(options, function(err,data){
        return callback(err,data);
    })
  }

  function getPres(callback){
    getData(function(err,jsonObj){
      return callback(err,jsonObj.main.pressure);
    })
  }

  function getTemp(callback){
    getData(function(err,jsonObj){
      return callback(err,jsonObj.main.temp);
    })
  }

  function getHum(callback){
    getData(function(err,jsonObj){
      return callback(err,jsonObj.main.humidity);
    })
  }

  function getDesc(callback){
    getData(function(err,jsonObj){

      return callback(err, (jsonObj.weather)[0].description);
    })
  }

  function getSmart(callback){
    getData(function(err,jsonObj){
      var smartJSON = {};
      smartJSON.temp = jsonObj.main.temp;
      smartJSON.humidity = jsonObj.main.humidity;
      smartJSON.pressure = jsonObj.main.pressure;
      smartJSON.description = (jsonObj.weather)[0].description;
      smartJSON.weathercode = ((jsonObj.weather[0]).id);
      return callback(err,smartJSON);
    })
  }

  function getResponseBF(field,callback){
    var req = http.get(options, function(res){
      res.on('end', function(){
      });
			return callback(null, res[field]);
    });
  }

  function buildPath(){

    return '/data/2.5/weather?q=' + config.city + '&units=' + config.units + '&lang=' + config.lan + '&APPID=' + config.APPID;

  }

  function getData(callback){
    options.path = buildPath();
    var req = http.get(options, function(res){
      res.setEncoding('utf-8');
      res.on('data', function (chunk) {
          var parsed = {};
          // Try-Catch added by Mikael Aspehed
          try{
            parsed = JSON.parse(chunk)
          }catch(e){
            parsed = {error:e}
          }

          return callback(null,parsed);
      });

      res.on('error', function(err){
          return callback(err, null);
      })
    });
  }



})();
