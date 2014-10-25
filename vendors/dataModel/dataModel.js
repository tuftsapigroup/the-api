/* jshint node: true */
/*
 * Local cache system for server
 */

var trieLib = require('./trie'),
	trie = new trieLib.Trie(2), // Trie that forces to lowercase
	keys = require('./parseKeys'),
	Parse = require('parse').Parse;


/* Data dump queries */

// All course data (by callnums)
exports.CallnumsToCourses = function() { return callnumsToCoursedata; }

// All course data (by department)
exports.DepartmentsToCourses = function() { return depToCoursedata; }

// All course data (by professors)
exports.ProfessorsToCourses = function() { return profToCoursedata; }

// All callnumbers
exports.AllCallnumbers = function () { return callnums; }

// All professors
exports.AllProfessors = function () { return professors; }

// All departments
exports.AllDepartments = function() { return departments; }

// All requirements
exports.AllRequirements = function() { return requirements; }


/* Internal fields */

var IDToCoursedata = {};
var depToCoursedata = {};
var profToCoursedata = {};
var callnumsToISBNs = {};
var callnumsToCoursedata = {};
var ISBNToBNdata = {};
var departments = ['Any'];
var requirements = ['Any'];
var callnums = [];
var uniqueIds = [];
var professors = [];


/* Definitions */

exports.initialize = function () {

	// Connect to the ParseJS API
	Parse.initialize(keys.ParseAppId(), keys.ParseJavascriptId());

	// Create fake data entry in Parse to test it
	if (false) {
	//if (true) {
		addDataToParse();
	}
}

exports.ISBNs = function (callnum) {
	return callnumsToISBNs[callnum];
}

exports.BookstoreJSON = function (isbn) {
	return ISBNToBNdata[isbn];
}

// Searchable JSON
exports.Searchable = function (searchterm) {
	searchJSON = trie.search(searchterm);

	if (searchJSON.length > 0) {

		// Used to sort
		searchJSON.sort(function(x,y){return x.callnum > y.callnum;});
		searchJSON.sort(function(x,y){return x.callnum > y.callnum;});

		return searchJSON;
	}

	return []
}

// Grab a fresh copy from ParseJS
exports.refreshLocalCaches = function () {

	// Refresh local caches with course data,
	// have to do it in batches
	for (var i=0; i < 2150; i+=100) {
		var query = new Parse.Query('TryingAsync');
		query.skip(i);
		query.limit(100); // Max

		query.find({
			success: parseCourseQueries,
			error: console.error
		});
	}
}

// Parse the query strings received from ParseJS
// Input data into local objects that store course data
var parseCourseQueries = function (res) {
	var depCheck = {};
	var reqCheck = {};
	for (var i in res) {
		var data = res[i]._serverData;
		var currCourse = {};

		currCourse['prof'] = data['prof'];
		currCourse['title'] = data['title'];
		currCourse['isbns'] = data['isbns'];
		currCourse['reqs'] = data['reqs'];
		currCourse['id'] = res[i]['id'];
		currCourse['schedule'] = data['schedule'];
		currCourse['status'] = data['status']

		currCourse['callnum'] = data['callnum'].toUpperCase(); // ENG-0045-01
		currCourse['dep'] = data['dep']; // English
		currCourse['depCode'] = data['depCode'].toUpperCase(); // ENG
		currCourse['coursenum']  = data['coursenum'].toUpperCase(); // 0045
		currCourse['sec'] = data['sec']; // 01

		// Add ISBNs to ISBN structure
		callnumsToISBNs[currCourse['callnum']] = [];
		for (var i in currCourse['isbns']) {
			callnumsToISBNs[currCourse['callnum']].push(currCourse['isbns'][i]);
		}

		// Add Departments to Department list
		var shouldAdd = true;
		for (var i=0; i < departments.length; i++) {
			if (departments[i] == currCourse['dep']) {
				shouldAdd = false;
			}
		}
		if (shouldAdd) {
			departments.push(currCourse['dep']);
		}

		// Add Requirements to Requirement list
		for (var j=0; j<currCourse['reqs'].length; j++) {
			var shouldAdd = true;
			for (var i=0; i < requirements.length; i++) {
				if (requirements[i] == currCourse['reqs'][j]) {
					shouldAdd = false;
				}
			}
			if (shouldAdd) {
				requirements.push(currCourse['reqs'][j]);
			}
		}

		// Add Callnum to Callnum list
		var shouldAdd = true;
		for (var i=0; i < callnums.length; i++) {
			if (callnums[i] == currCourse['callnum']) {
				shouldAdd = false;
			}
		}
		if (shouldAdd) {
			callnums.push(currCourse['callnum']);
		}

		// Add Unique ID to Unique ID list
		if (!(currCourse['id'] in uniqueIds)) {
			uniqueIds.push(currCourse['id']);
		}

		// Add Professor to Professor list
		var shouldAdd = true;
		for (var i=0; i < professors.length; i++) {
			if (professors[i] == currCourse['prof']) {
				shouldAdd = false;
			}
		}
		if (shouldAdd) {
			professors.push(currCourse['prof']);
		}


		IDToCoursedata[currCourse['id']] = currCourse;
		addPermutations(currCourse);
		callnumsToCoursedata[data['callnum']] = currCourse;

		// Create lists for every department
		if (!depToCoursedata[currCourse['dep']]) {
			depToCoursedata[currCourse['dep']] = [];
		}
		if (!depToCoursedata['Any']) {
			depToCoursedata['Any'] = [];
		}
		depToCoursedata[currCourse['dep']].push(currCourse);
		depToCoursedata['Any'].push(currCourse);
	}
	console.log('Refreshing the caches');
}

// Add all searchable permutations to trie
var addPermutations = function (course) {
	var keys = [];

	// Professor
	keys.push(course['prof']);
	for (var i in course['prof'].split(' ')) {
		keys.push(course['prof'].split(' ')[i]);
	}

	// Title
	keys.push(course['title']);
	for (var i in course['title'].split(' ')) {
		keys.push(course['title'].split(' ')[i]);
	}
	for (var i in course['title'].split(':')) {
		keys.push(course['title'].split(':')[i]);
	}

	// Callnum
	keys.push(course['callnum']);
	keys.push(course['callnum'].replace('-', ' '));
	keys.push(course['callnum'].replace('-', ''));
	keys.push(course['depCode']);
	keys.push(course['dep']);
	keys.push(course['depCode'] + String(parseInt(course['coursenum'], 10)));
	keys.push(course['depCode'] + " " + String(parseInt(course['coursenum'], 10)));
	keys.push(course['depCode'] + "-" + String(parseInt(course['coursenum'], 10)));

	for (var i in keys) {
		trie.add(keys[i].toLowerCase(), course);
	}
}

// 2 Classes added to Parse for use-data
var addDataToParse = function () {
	var NewClass = Parse.Object.extend('Courses');
	var newClass = new NewClass();

	console.log('before eng45 set');
	newClass.set({
		status: 'open',
		reqs: [
			'World Civilization',
			'Humanities'
		],
		callnum: 'eng-0045-01',
		prof: 'Modhumita Roy',
		dep: 'English',
		depCode: 'eng',
		sec: '01',
		coursenum: '0045',
		title: 'Nonwestern Women Writers',
		books: [
		{
			isbn: '9780393308808',
			title: 'Wide Sargasso Sea',
			author: 'Jean Rhys'
		},
		{
			isbn: '9780385420174',
			title: 'Like Water for Chocolate',
			author: 'Laura Esquivel'
		},
		{
			isbn: '9780156008297',
			title: 'The Pagoda',
			author: 'Patricia Powell'
		}],
		schedule: {
			mon: '10:30-11:45',
			tue: '',
			wed: '10:30-11:45',
			thu: '',
			fri: '',
			sat: '',
			sun: ''
		}
	});
	newClass.save();
	console.log('after eng45 set');

	var NewClass = Parse.Object.extend('Courses');
	var newClass = new NewClass();

	console.log('before sp3 set');
	newClass.set({
		status: 'open',
		reqs: [
			'Language Dist'
		],
		callnum: 'spn-0003-f',
		prof: 'Anne de Laire Mulgrew',
		dep: 'Spanish',
		depCode: 'spn',
		sec: 'f',
		coursenum: '0003',
		title: 'Intermediate Spanish I',
		books: [
		{
			isbn: '9780425175552',
			title: 'The American Hertiage Spanish Dictionary',
			author: 'Unauthored'
		}],
		schedule: {
			mon: '',
			tue: '1:30-2:20',
			wed: '',
			thu: '1:30-2:20',
			fri: '2:30-3:20',
			sat: '',
			sun: ''
		}
	});
	newClass.save();
	console.log('after sp3 set');
}