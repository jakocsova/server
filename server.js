var express = require("express");
var server = express();
var path = require("path");

var PORT=3000

server.get('/getCapabilities', function (request, response) {
    
response.sendFile(path.join(__dirname + "\\CapabilitiesDokument.xml"))
})

server.get("/some/path", function(request, response) {
    console.log(request.query.jahoda);
    response.send(request.query);
  });


server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });


