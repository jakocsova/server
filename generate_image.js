var path = require("path"); // modul na prácu s adresármi a cestami súborov
var fs = require("fs"); // modul, ktorý umožňuje pracovať so systémom súborov
var mapnik = require("mapnik"); // knižnica na vykresľovanie máp

mapnik.register_default_fonts(); // register predvolených fontov v mapniku
mapnik.register_default_input_plugins(); // register predvolených pluginov

function generateImage(arg, sendFile){ // funkcia na generovanie obrázku
var width = Number(arg.WIDTH); // šírka mapového obrázku v pixeloch, funkcia Number() zabezpečí prevod vstupného argumentu na číslo
var height = Number(arg.HEIGHT); // výška mapového obrázku v pixeloch
var bbox = arg.BBOX.split(',').map(function(elem){ // funkcia split sa používa na rozdelenie daného reťazca na pole reťazcov (oddelenie pomocou oddeľovača)
    return Number(elem)}); // súradnice ľavého dolného a pravého horného rohu obrázku 
var layers=(arg.LAYERS).split(',');

var map = new mapnik.Map(width, height); // tvorba nového mapového objektu s definovanou šírkou a výškou

var addBudovy=arg.LAYERS.includes('budovy'); // premenná, ktorá obsahuje vrstvu budovy, ak daná vrtsva existuje
var addCesty=arg.LAYERS.includes('cesty');
var addLavicky=arg.LAYERS.includes('lavicky');
var addOdpad=arg.LAYERS.includes('odpad');
var addStravovanie=arg.LAYERS.includes('stravovanie');
var addParkovisko=arg.LAYERS.includes('parkovisko');
var addCintorin=arg.LAYERS.includes('cintorin');

var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";
// projekcia (Krovak)

var style_budovy='<Style name="style_budovy">' + // štýl pre vrstvu budovy 
'<Rule>' +
    '<LineSymbolizer stroke="black" stroke-width="0.8" />' + // štýl pre línie, stroke=farba, stroke-width=hrúbka čiar
    '<PolygonSymbolizer fill="#cfafaf"  />' + // štýl pre polygón, fill=výplň
    '</Rule>' +
    '</Style>' 
    
var style_cesty='<Style name="style_cesty">' + // štýl pre vrstvu cesty
    '<Rule>' +
    '<MinScaleDenominator>8001</MinScaleDenominator>'+ // označuje minimálnu mierku mapy, pri ktorej je línia ešte vykreslená
    '<LineSymbolizer stroke="black" stroke-width="0.5"/>' + // štýl pre línie
    '</Rule>' +

    '<Rule>' +
    '<MaxScaleDenominator>8000</MaxScaleDenominator>'+ // označuje maximálnu mierku mapy, pri ktorej je ešte daný prvok zobrazený
     '<LineSymbolizer stroke="#ffff86" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" />' + // stroke-linejoin=typ spojenia línií, stroke-linecap=typ ukončenia čiar
    '<LineSymbolizer stroke="#414141" stroke-width="1" stroke-linejoin="round" stroke-dasharray="6,2" stroke-linecap="round" />'+ // stroke-dasharray=čiarkovaná línia, určujeme veľkosť čiar a medzier
    '<LineSymbolizer stroke="#414141" stroke-width="0.5" offset="3" stroke-linecap="round" />' + // offset=rozozstup čiar
    '<LineSymbolizer stroke="#414141" stroke-width="0.5" offset="-3" stroke-linecap="round" />' +
    '</Rule>' +
'</Style>' 

var style_lavicky='<Style name="style_lavicky">' + // štýl pre vrstvu lavičky
'<Rule>' +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>20</MinScaleDenominator>'+
'<MarkersSymbolizer file="./icon/lavicka4.png" width="20" height="20"  />'+ // štýl pre symbol, podporuje súbory png, tiff, svg, nastavíme šírku a výšku obrázku v pixeloch
'</Rule>' +
'</Style>' 

var style_odpad='<Style name="style_odpad">' + // štýl pre vrstvu odpad
'<Rule>' +
"<Filter>[TYP] = 'Komunalny odpad'</Filter>" + // filter, ktorý umožňuje výber dát podľa nejakého atribútu
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>20</MinScaleDenominator>'+
'<MarkersSymbolizer file="./icon/odpad.png" width="15" height="15" />'+
'</Rule>' +

'<Rule>' +
"<Filter>[TYP] = 'Plast'</Filter>" +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>20</MinScaleDenominator>'+
'<MarkersSymbolizer file="./icon/odpad_oranzova.png" width="15" height="15" />'+
'</Rule>' +

'<Rule>' +
"<Filter>[TYP] = 'Biologicky odpad'</Filter>" +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>20</MinScaleDenominator>'+
'<MarkersSymbolizer file="./icon/odpad_zelena.png" width="15" height="15" />'+
'</Rule>' +
'<Rule>' +
"<Filter>[TYP] = 'Sklo'</Filter>" +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>20</MinScaleDenominator>'+
'<MarkersSymbolizer file="./icon/cierna.png" width="15" height="15" />'+
'</Rule>' +

'<Rule>' +
"<Filter>[TYP] = 'Papier'</Filter>" +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>20</MinScaleDenominator>'+
'<MarkersSymbolizer file="./icon/fialova.png" width="15" height="15" />'+
'</Rule>' +

'<Rule>' +
"<Filter>[TYP] = 'satstvo'</Filter>" +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>20</MinScaleDenominator>'+
'<MarkersSymbolizer file="./icon/modra.png" width="15" height="15" />'+
'</Rule>' +
'</Style>' 

var style_stravovanie='<Style name="style_stravovanie">' + // štýl pre vrstvu stravovanie
'<Rule>' +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>20</MinScaleDenominator>'+
'<MarkersSymbolizer file="./icon/food.png" width="22" height="22" />'+
'</Rule>' +
'</Style>' 

var style_parkovisko='<Style name="style_parkovisko">' + // štýl pre vrstvu parkovisko
'<Rule>' +
'<LineSymbolizer stroke="black" stroke-width="0.8" />' + 
'<PolygonSymbolizer fill="#40e0dd"  />' + 
'</Rule>' +
'<Rule>' +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>20</MinScaleDenominator>'+
'<TextSymbolizer placement="dummy" face-name="DejaVu Sans Condensed Bold" size="15" fill="#004080" allow-overlap="false" > "P" </TextSymbolizer>'+ 
// štýl pre text, placement=umiestnenie, face-name=font písma, size=veľkosť písma, fill=výplň, allow-overlap=umožňuje prekryt
'</Rule>' +
'</Style>' 

var style_cintorin='<Style name="style_cintorin">' + // štýl pre vrstvu cintorín
'<Rule>' +
'<LineSymbolizer stroke="black" stroke-width="0.7" />' + 
'<PolygonSymbolizer fill="#b9f1a6"  />' + 
'</Rule>' +
'<Rule>' +
'<MaxScaleDenominator>3000</MaxScaleDenominator>' +
'<MinScaleDenominator>100</MinScaleDenominator>'+
'<PolygonPatternSymbolizer file="./icon/kriz6.png" />'+ //šablóna na výplň uzavretého polygónu
'</Rule>' +
'</Style>' 

var layer_budovy = '<Layer name="budovy" srs="'+proj+'">' + // vrstva budovy s priestorovým referenčným systémom
'<StyleName>style_budovy</StyleName>' + // naviazanie na štýl pre vrstvu budovy
'<Datasource>' + // zdroj dát
'<Parameter name="file">' + path.join( __dirname, 'data/budovy.shp' ) +'</Parameter>' + // cesta k súboru
'<Parameter name="type">shape</Parameter>' + // formát súboru (shapefile)
'</Datasource>' +
'</Layer>' 

var layer_cesty = '<Layer name="cesty" srs="'+proj+'">' + // vrstva cesty s priestorovým referenčným systémom
'<StyleName>style_cesty</StyleName>' + // naviazanie na štýl pre vrstvu cesty
'<Datasource>' + // zdroj dát
'<Parameter name="file">' + path.join( __dirname, 'data/cesty.shp' ) +'</Parameter>' + // cesta k súboru
'<Parameter name="type">shape</Parameter>' + // formát súboru (shapefile)
'</Datasource>' +
'</Layer>'

var layer_odpad = '<Layer name="odpad" srs="'+proj+'">' + // takisto
'<StyleName>style_odpad</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/odpad.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>'

var layer_stravovanie = '<Layer name="stravovanie" srs="'+proj+'">' + // takisto
'<StyleName>style_stravovanie</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/stravovanie.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>'

var layer_parkovisko = '<Layer name="parkovisko" srs="'+proj+'">' + // takisto
'<StyleName>style_parkovisko</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/parkovisko.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>' 

var layer_cintorin = '<Layer name="cintorin" srs="'+proj+'">' + // takisto
'<StyleName>style_cintorin</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/cintorin.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>' 

var layer_lavicky = '<Layer name="lavicky" srs="'+proj+'">' + // takisto
'<StyleName>style_lavicky</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/lavicky.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>' 
   
// schema zobrazenej mapy
var schema = '<Map background-color="#f6f6f6" srs="'+proj+'">' + // definujeme farbu pozadia mapy a jej referenčný systém pomocou kódu EPSG
                (addBudovy ? style_budovy : '') + // podmienka (ak existuje premenná budovy, tak použije štýl tej vrstvy)
                (addBudovy ? layer_budovy : '') + // podmienka (ak existuje premenná budovy, tak pridá tú vrstvu)
                (addCesty ? style_cesty : '') +
                (addCesty ? layer_cesty : '') +
                (addParkovisko ? style_parkovisko : '') +
                (addParkovisko ? layer_parkovisko : '') +
                (addCintorin ? style_cintorin : '') +
                (addCintorin ? layer_cintorin : '') +
                (addLavicky ? style_lavicky : '') +
                (addLavicky ? layer_lavicky : '') +
                (addOdpad ? style_odpad : '') +
                (addOdpad ? layer_odpad : '') +
                (addStravovanie ? style_stravovanie : '') +
                (addStravovanie? layer_stravovanie : '') +   
            '</Map>';
// schema mapy na definuje vrstvy, zdroj dát a štýl týchto vrstiev

map.fromString(schema, function(err, map) { // použitá metóda fromString => musíme použiť xml schému vo vnútry premennej schema
  if (err) {
      console.log('Map Schema Error: ' + err.message) // v prípade chyby pri spracovaní schémy ju vykonzolujeme 
  }
  map.zoomToBox(bbox); // približovanie mapy k ploche, ktorá je vymedzená súradnicami uvedenými v BBOX

  var im = new mapnik.Image(width, height); // definujeme nový mapnik obrázok s rovnakou šírkou a výškou ako má naša mapa 

  map.render(im, function(err, im) { // vykreslíme mapu do mapnik obrázku, ktorý je uložený v premennej "im"   
      
    if (err) {
        console.log('Map redner Error: ' + err.message) // vypíše chybu v prípade ak k nej dôjde
    }

    im.encode("png", function(err, buffer) { // zakóduje obrázok do formátu png
      if (err) {
         console.log('Encode Error: ' + err.message) // vypíše chybu v prípade potreby
      }

      fs.writeFile( // použijeme node balíček na prácu so systémom súborov (fs) na zápis do súboru 
        path.join(__dirname, "out/map.png"), // skombinuje adresár nášho bežiaceho skriptu s požadovaným obrázkom 
        buffer, // vloží obrazový buffer vytvorený metódou "im.encode" obrazového mapníka
        function(err) {
          if (err) {
              console.log(' Fs Write Error: ' + err.message) // vypíše chybu v prípade ak k nej dôjde
          }
          console.log('Image generated into: ' + 
            path.join(__dirname, "out/map.png") // vypíše cestu k uloženému obrázku "map.png"
            // po výpise správy "Image generated into..." môžeme otvoriť náš vygenerovaný obrázok
            // je môžné meniť súradnice BBOX, výšku a šírku obrázku, ako aj štýl vrstiev 
          );
          sendFile(path.join(__dirname ,"out/map.png")); // odoslanie obsahu do uvedeného adresára
        }
      );
    });
  });
})
};

module.exports = generateImage; // tvorba nového modulu, ktorý obsahuje funkciu generateImage
