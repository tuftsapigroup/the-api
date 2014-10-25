/* jshint node : true */

exports.socketServer = function(server) {
	var io = require('socket.io', { rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] }).listen(server),
		dataModel = require('../vendors/dataModel/dataModel'),
		events = require('events'),
		BISON = require('../public/js/lib/bison');

	//  Don't log debug info, slows down transmission
	io.set('log level', 0);

	io.sockets.on('connection', function (socket) {
		console.log('New Socket Connected');	


	});
}