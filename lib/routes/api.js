/* jshint node: true */

/*
 * GET api calls
 */

var request = require('request'),
	dataModel = require('../../vendors/dataModel/dataModel'),
  	events = require('events');

/* Query Definitions */

// Course data dumps
exports.CallnumsToCourses = function(req, res) { res.json(dataModel.CallnumsToCourses()); };
exports.DepartmentsToCourses = function(req, res) { res.json(dataModel.DepartmentsToCourses()); };

// Data field dumps
exports.AllCallnumbers = function(req, res) { res.json(dataModel.AllCallnumbers()); };
exports.AllProfessors = function(req, res) { res.json(dataModel.AllProfessors()); };
exports.AllDepartments = function(req, res) { res.json(dataModel.AllDepartments()); };
exports.AllRequirements = function(req, res) { res.json(dataModel.AllRequirements()); };
