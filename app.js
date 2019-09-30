var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var port = 8000;
var app = express();

app.get('/wikipedia', function (req,res){

var url = "https://nl.wikipedia.org/wiki/Kat_(dier)";

request(url, function(error, response, html){
if(!error){


  var wiki_data = {
    title: '',
    img: '',
    paragraph: '',
  };

  var $ = cheerio.load(html);

  $ ('#content').filter(function(){
    wiki_data.title = $(this).find('h1').text();
    wiki_data.img = $(this).find('img:nth-of-type(2)').first().attr('src');
    wiki_data.paragraph = $(this).find('p').first().text();
  });

  res.send(wiki_data);
    }

  });
});

app.get('/imdb', function (req,res){

var url = "https://www.imdb.com/chart/top";

request(url, function(error, response, html){

if(!error){
  var imdb_data = [];

  var $ = cheerio.load(html);

  $ ('.lister').filter(function(){
    $(this).find('tr').each(function(i, element){   // tr wordt aangegeven op de imdb site als de code opzoekt achter de site

      imdb_data[i] = "'" + $(this).find('img').attr('src') + "'";

    });
  });

  res.send(imdb_data);
fs.writeFile('imdb_output.js',"var imdb_output =[" + imdb_data +"]", function(error){  //imdb_output.js als je er imdb_output2.js van maakt, word er een nieuw document opgeslagen
  console.log('file is written successfully')
})


    }
  });
});

app.listen(port);
console.log('Magic happens on port' + port);
exports = module.exports = app;
