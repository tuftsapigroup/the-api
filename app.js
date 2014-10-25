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
dataModel.initialize();                //  Initializes data model
dataModel.refreshLocalCaches();        //  Refreshes local caches


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

/* HTTP public API requests */

// Data fields
app.get('/api/callToCourse', api.CallnumsToCourses);
app.get('/api/deptToCourse', api.DepartmentsToCourses);
app.get('/api/profToCourse', api.ProfessorsToCourses);

app.get('/api/callnums', api.AllCallnumbers);
app.get('/api/profs', api.AllProfessors);
app.get('/api/depts', api.AllDepartments);
app.get('/api/reqs', api.AllRequirements);


// Special URL to refresh data without restarting server
app.get('/api/i/need/to/refresh/', routes.refresh);

//  Create the server, start listening
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Tufts University API server listening on port ' + app.get('port'));
});

socketServer.socketServer(server);