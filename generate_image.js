var path = require("path");
var fs = require("fs");
var mapnik = require("mapnik"); // lib for map rendering

mapnik.register_default_fonts(); // register some default fonts into mapnik
mapnik.register_default_input_plugins(); // same with plugins

function generateImage(arg, sendFile){
var width = Number(arg.WIDTH); // with of map image in pixels
var height = Number(arg.HEIGHT); // height -||-
var bbox = arg.BBOX.split(',').map(function(elem){
    return Number(elem)}); // bottom left corner coords and top right corner coords of the image 
var layers=(arg.LAYERS).split(',');

var map = new mapnik.Map(width, height);
// create new map object with defined width and height

var addBudovy=arg.LAYERS.includes('budovy');
var addCesty=arg.LAYERS.includes('cesty');
var addLavicky=arg.LAYERS.includes('lavicky');
var addOdpad=arg.LAYERS.includes('odpad');
var addStravovanie=arg.LAYERS.includes('stravovanie');
var addParkovisko=arg.LAYERS.includes('parkovisko');


var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";

var style_budovy='<Style name="style_budovy">' + // style for layer "style_budovy"
'<Rule>' +
    '<LineSymbolizer stroke="black" stroke-width="0.8" />' + // style for lines
    '<PolygonSymbolizer fill="#cfafaf"  />' + // style for polygons
    '</Rule>' +
    '</Style>' 
    
var style_cesty='<Style name="style_cesty">' + // style for layer "style_cesty"
    '<Rule>' +
    '<MinScaleDenominator>9000</MinScaleDenominator>'+
    '<LineSymbolizer stroke="black" stroke-width="0.5"/>' + // style for lines
    '</Rule>' +

    '<Rule>' +
    '<MaxScaleDenominator>8000</MaxScaleDenominator>'+
     '<LineSymbolizer stroke="#ffff86" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" />' + // style for lines
    '<LineSymbolizer stroke="#414141" stroke-width="1" stroke-linejoin="round" stroke-dasharray="6,2" stroke-linecap="round" />'+
    '<LineSymbolizer stroke="#414141" stroke-width="0.5" offset="3" stroke-linecap="round" />' +
    '<LineSymbolizer stroke="#414141" stroke-width="0.5" offset="-3" stroke-linecap="round" />' +
    '</Rule>' +
'</Style>' 

var style_lavicky='<Style name="style_lavicky">' + // style for layer "style_lavicky"
'<Rule>' +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>200</MinScaleDenominator>'+
'<MarkersSymbolizer file="./icon/lavicka4.png" width="20" height="20"  />'+
'</Rule>' +
'</Style>' 

var style_odpad='<Style name="style_odpad">' + // style for layer "style_lavicky"
'<Rule>' +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>200</MinScaleDenominator>'+
'<MarkersSymbolizer file="./icon/odpad.png" width="15" height="15" />'+
'</Rule>' +
'</Style>' 

var style_stravovanie='<Style name="style_stravovanie">' + // style for layer "style_lavicky"
'<Rule>' +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>200</MinScaleDenominator>'+
'<MarkersSymbolizer file="./icon/food.png" width="22" height="22" />'+
'</Rule>' +
'</Style>' 

var style_parkovisko='<Style name="style_parkovisko">' + // style for layer "style_lavicky"
'<Rule>' +
'<LineSymbolizer stroke="black" stroke-width="0.8" />' + // style for lines
'<PolygonSymbolizer fill="#40e0dd"  />' + 
'</Rule>' +
'<Rule>' +
'<MaxScaleDenominator>5866</MaxScaleDenominator>' +
'<MinScaleDenominator>200</MinScaleDenominator>'+
'<TextSymbolizer placement="dummy" face-name="DejaVu Sans Condensed Bold" size="15" fill="#004080" allow-overlap="false" clip="false"> "P" </TextSymbolizer>'+
'</Rule>' +
'</Style>' 

var layer_budovy = '<Layer name="budovy" srs="'+proj+'">' + // same as above
'<StyleName>style_budovy</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/budovy.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>' 

var layer_cesty = '<Layer name="cesty" srs="'+proj+'">' + // layer "cesty" with spatial reference system
'<StyleName>style_cesty</StyleName>' + // binding of a style used for this layer => "style_cesty"
'<Datasource>' + // definition of a data source
'<Parameter name="file">' + path.join( __dirname, 'data/cesty.shp' ) +'</Parameter>' + // path to the data file
'<Parameter name="type">shape</Parameter>' + // file type
'</Datasource>' +
'</Layer>'

var layer_odpad = '<Layer name="odpad" srs="'+proj+'">' + // same as above
'<StyleName>style_odpad</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/odpad.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>'

var layer_stravovanie = '<Layer name="stravovanie" srs="'+proj+'">' + // same as above
'<StyleName>style_stravovanie</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/stravovanie.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>'

var layer_parkovisko = '<Layer name="parkovisko" srs="'+proj+'">' + // same as above
'<StyleName>style_parkovisko</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/parkovisko.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>' 

var layer_lavicky = '<Layer name="lavicky" srs="'+proj+'">' + // same as above
'<StyleName>style_lavicky</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/lavicky.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>' 
   
// schema of the rendered map
var schema = '<Map background-color="#f6f6f6" srs="'+proj+'">' + // we define background color of the map and its spatial reference system with epsg code of data used
                (addBudovy ? style_budovy : '') +
                (addBudovy ? layer_budovy : '') +
                (addCesty ? style_cesty : '') +
                (addCesty ? layer_cesty : '') +
                (addParkovisko ? style_parkovisko : '') +
                (addParkovisko ? layer_parkovisko : '') +
                (addLavicky ? style_lavicky : '') +
                (addLavicky ? layer_lavicky : '') +
                (addOdpad ? style_odpad : '') +
                (addOdpad ? layer_odpad : '') +
                (addStravovanie ? style_stravovanie : '') +
                (addStravovanie? layer_stravovanie : '') +   
            '</Map>';
// now we have a mapnik xml in variable schema that defines layers, data sources and styles of the layers

map.fromString(schema, function(err, map) { // we use method "fromString" => we need to use the xml schema inside variable schema
  if (err) {
      console.log('Map Schema Error: ' + err.message) // if there is an error in schema processing we print it out
  }
  map.zoomToBox(bbox); // let's zoom our mapnik map to bounding box stored in BBOX variable

  var im = new mapnik.Image(width, height); // we define new mapnik image with the same width and height as our map

  map.render(im, function(err, im) { // render the map into mapnik image stored in variable "im"
      
    if (err) {
        console.log('Map redner Error: ' + err.message) // print an error if it occures
    }

    im.encode("png", function(err, buffer) { // encoude our image into "png"
      if (err) {
         console.log('Encode Error: ' + err.message) // same same
      }

      fs.writeFile( // we ouse node file system package "fs" to write into file, first parameter is path to our file
        path.join(__dirname, "out/map.png"), // combine directory of our running script and desired map image
        buffer, // insert the image buffer created by "im.encode" method of mapnik image
        function(err) {
          if (err) {
              console.log(' Fs Write Error: ' + err.message) // same same
          }
          console.log('Image generated into: ' + 
            path.join(__dirname, "out/map.png") // we print our path to created image when the image is all writen into "map.png"
            // after the "Image generated into..." message is out, we can open our generated image
            // change the bounding box, width, height and style if you want
          );
          sendFile(path.join(__dirname ,"out/map.png"));
        }
      );
    });
  });
})
};

module.exports = generateImage;
