// use express for handling HTTP requests
var express = require('express');
// instantiate express
var app = express();
// use fs for active writing/reading of data.json (serves as pseudo database)
var fs = require('fs');
// use path for creating asset pipeline through the public folder
var path = require('path');
// use bodyParser for reading http request body in POST requests
var bodyParser = require('body-parser')

// configuration of port / asset pipeline / bodyParser
app.set('port', process.env.PORT || 3000)
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));

// set up index route
app.get('/', function(req, res){
  res.render('index')
});

// set up favorites get route
app.get('/favorites', function(req, res){
  var data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

// set up favorites post route
app.post('/favorites', function(req, res){
  if(!req.body.Title || !req.body.imdbID){
    res.send("Error");
    return
  }
  var data = JSON.parse(fs.readFileSync('./data.json'));
  data.push(req.body);
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

// set server port
app.listen(app.get('port'), function(){
  console.log("Listening on port 3000");
});
