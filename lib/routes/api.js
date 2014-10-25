/* jshint node: true */
/*
 * GET api calls
 */

var request = require('request'),
	dataModel = require('../../vendors/dataModel/dataModel'),
  events = require('events');

//  Call numbers to course data
//  Used by class search
exports.apiQuery = function (req, res) {
	res.json(dataModel.Searchable(req.params.query));
};