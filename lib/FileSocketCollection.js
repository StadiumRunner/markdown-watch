
/**
 * Module Dependencies
 * 
 * fs 			filesystem access
 * _ 			array + collection tools
 * 
 */

var fs = require('fs'),
	_ = require('lodash');




/**
  * FileSocketCollection
  * 
  * 	This object is where we track all the
  * 	currently watched files and connected
  * 	sockets.
  *
  *		Example: {
  * 		'relative/path/to/file' : {
  * 			'socket'  : <socket.io socket>,
  * 			'watcher' : <FSWatcher object>
  * 		},
  * 		...
  * 	}
  * 	
  */

var FileSocketCollection = function () {

	// Easy 'new' constructor check
	if (!(this instanceof FileSocketCollection))
		return new FileSocketCollection.apply(arguments);

	Files = {};

}

FileSocketCollection.prototype.add = function (filepath, socket) {

	if ( !fs.existsSync(filepath) )
		throw new Error('File "'+filepath+'" does not exist!');

	var watcher = fs.watch(filepath);
	watcher.on('change', function (event, filename) {
		//console.log('Reloading %s', filepath);
		socket.emit('reload');
	})

	Files[ filepath ] = {
		socket: socket,
		watcher: watcher
	}

	var self = this;

	/** Remove socket + watcher data for
	  * disconnected socket. We don't need
	  * to watch that file anymore either...
	  */
	socket.on('disconnect', function () {

		self.remove(filepath);

	});

}

FileSocketCollection.prototype.remove = function (key) {

	if ( !key || !_.has(Files, key) )
		throw new Error('Invalid key.');

	var data = Files[ key ];

	try {
		_.invoke(data, 'close');
	}
	catch (error) {
		
	}
	finally {
		delete Files[ key ];
	}

}

FileSocketCollection.prototype.find = function (query) {

	// Handle filepath key
	if ( _.isString(query) )
		return Files[ query ];

	else return _.find(Files, query);

}







module.exports = FileSocketCollection;





