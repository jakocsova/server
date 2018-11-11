var express = require("express");
var server = express();
var path = require("path");
var fs = require("fs");
var mapnik = require("mapnik");
var generateImage = require('./generate_image.js');

console.log(generateImage);

var PORT=3021;


server.get('/wms', function (request, response) {
    var params=request.query;
    console.log(params);
    if(params.SERVICE==="WMS" && params.REQUEST==="GetCapabilities"){
      response.sendFile(path.join(__dirname , "nase_vrstvy.xml"))
    }else if (params.SERVICE==="WMS"&& params.REQUEST==="GetMap"){
     generateImage(params, response.sendFile.bind(response))
    }else{
  response.send("nepodporovana metoda")
}

})

server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });


