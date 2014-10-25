/* jshint node: true */

var request = require('request'),
	dataModel = require('../../vendors/dataModel/dataModel'),
	events = require('events'),
	inspect = require('eyespect').inspector(),
	interfaceAddresses = require('interface-addresses'),
	addresses = interfaceAddresses();

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

/*
 * GET refresh
 */

exports.refresh = function(req, res){
	dataModel.refreshLocalCaches();
	res.json(dataModel.CourseDump());
}