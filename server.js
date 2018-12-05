var express = require("express"); // webový aplikačný rámec, ktorý umožňuje rýchlu tvorbu webových aplikácií
var server = express(); // vytvorí sa nová inštancia expresu v danej premennej
var path = require("path"); // modul na prácu s adresármi a cestami súborov
var fs = require("fs"); // modul, ktorý umožňuje pracovať so systémom súborov
var mapnik = require("mapnik"); // knižnica na vykresľovanie máp
var generateImage = require('./generate_image.js'); // vytvorený modul na generovanie obrázku

console.log(generateImage);

var PORT=3021; // udáva miesto pripojenia na server WMS 

server.use(express.static('icon')); 
// použijeme v prípade, že chceme zobraziť súbory ako obrázky, alebo CSS súbory
// argument funkcie špecifikuje adresár z ktorého sa majú stať statické súbory

server.get('/wms', function (request, response) { // metóda get slúži na vyzdvihnutie objektu (html, súboru, obrázku, ...) zo servera
    var params=request.query; // žiadané vstupné parametre (metadáta) sú uložené do premennej params
    console.log(params); // vykonzoluje naše vstupné parametre
    // ďalej postupujeme podľa toho čo budú vstupné parametre service a request
    if(params.SERVICE==="WMS" && params.REQUEST==="GetCapabilities"){ // v prípade, že SERVICE=WMS a REQUEST=GetCapabilities pošle sa súbor xml - metadáta služby
      response.sendFile(path.join(__dirname , "nase_vrstvy.xml")) // response=odpoveď
    }else if (params.SERVICE==="WMS"&& params.REQUEST==="GetMap"){ // v prípade, že SERVICE=WMS a REQUEST=GetMap, tak sa použije funkcia na generovanie obrázku, do ktorej vstupujú zadané parametre
     generateImage(params, response.sendFile.bind(response))
    }else{
  response.send("nepodporovana metoda") // ak je zadané niečo iné pošle sa oznam: nepodporované
}

});

server.listen(PORT, function() { // metóda listen slúži na pripojenie na náš server
    console.log("Server listening on port " + PORT + "!"); // vykonzoluje kde sa môžeme pripojiť na náš server
  });


