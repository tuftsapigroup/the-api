/* jshint node: true */
/**
 * Module dependencies.
 */

//  Configure express
var express = require('express'),
    routes = require('./lib/routes'),
    api  = require('./lib/routes/api'),
    http = require('http'),
    path = require('path'),
    socketServer = require('./lib/socketServer');

//  Configure DUST
var dust = require('consolidate').dust;

var app = express();

// Configure data model
var dataModel = require('./vendors/dataModel/dataModel');
//dataModel.initialize();                Initializes data model
//dataModel.refreshLocalCaches();        Refreshes local caches


// Configure environments
app.engine('dust' , dust);
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'dust');
// app.use(express.favicon('public/img/favicon.ico')); Favicon
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', routes.index);

// Special URL to refresh data without restarting heroku instance
app.get('/api/i/need/to/refresh/', routes.refresh);

//  Create the server, start listening
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Tufts University API server listening on port ' + app.get('port'));
});

socketServer.socketServer(server);