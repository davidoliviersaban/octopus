
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  http = require('http'),
  path = require('path'),
  routes = require('./routes'),
  eleve_api = require('./routes/eleve_api')
;


var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


app.use(bodyParser.urlencoded({ extended: true,limit: '5mb'}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API ELEVES
app.post('/api/eleve/all', eleve_api.getAllEleves);
app.post('/api/eleve/get', eleve_api.getEleve);
app.post('/api/eleve/update', eleve_api.updateEleve);
app.post('/api/eleve/delete', eleve_api.deleteEleve);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  eleve_api.getAllEleves();
});
