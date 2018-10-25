var express = require("express");
var server = express();
var path = require("path");

var PORT=3021

server.get('/wms', function (request, response) {
    var params=request.query;
    console.log(params);
    if(params.SERVICE==="WMS" && params.REQUEST==="GetCapabilities"){
      response.sendFile(path.join(__dirname , "nase_vrstvy.xml"))
}else if (params.service==="wms"&& params.request==="GetMap"){
console.log("idem robit get map")
}else{
  response.send("nepodporovana metoda")
}

})

server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });


