
/**
 * Module Dependencies
 * 
 * fs 						filesystem access
 * path 					domain + folder + extension manipulation
 * http 					http server
 * 
 * _ 						array + collection tools
 * program 					cli tools to parse arguments, etc.
 * marked					markdown to html parser
 * Handlebars 				HTML templating module
 * HTMLtemplate 			Easy function to compile + return the html template
 * FileSocketCollection 	Object that stores all sockets and file watchers
 * info						package.json file as an object
 * 
 */
var fs = require('fs'),
	path = require('path'),
	http = require('http'),
	_ = require('lodash'),
	program = require('commander'),
	marked = require('marked'),
	Handlebars = require('handlebars'),
	HTMLtemplate = Handlebars.compile( fs.readFileSync(path.join(__dirname, 'http/index.html'), {encoding: 'utf8'}) ),
	FileSocketCollection = require('./lib/FileSocketCollection'),
	info = require('./package.json');




var LiveFiles = new FileSocketCollection;


program
	.version( info.version )
	.option('-p --port <n>', 'HTTP listening port', parseInt, 8080);

program.parse(process.argv);



















var server = http.createServer(function (req, res) {

	var filepath = path.join(process.cwd(), req.url)
						.replace(path.extname(req.url), '')
						.concat('.md'),
		data = { port: program.port };

	if ( fs.existsSync(filepath) ) {

		res.statusCode = 200;	 // OK (202)

		var markdown = marked( fs.readFileSync(filepath, {encoding: 'utf8'}) );

		data.body = new Handlebars.SafeString( markdown );

	}
	else res.statusCode = 404;  // Not Found (404)

	res.setHeader('Content-Type', 'text/html');
	res.end( HTMLtemplate(data) );

});























/** Setup the socket.io server that all
  * clients will use to be notified of
  * relevant file changes to trigger a
  * page reload when file is changed.
  */
var socketIO = require('socket.io').listen(server, {log: false});

socketIO.on('connection', function (socket) {

	/** When client connects, it sends a 'watch'
	  * event with a relative path to the desired
	  * file.
	  */
	socket.on('watch', function (filepath) {

		filepath = path.join(process.cwd(), filepath)
						.replace(path.extname(filepath), '')
						.concat('.md');

		try {
			LiveFiles.add(filepath, socket);
		}
		catch (error) {
			//socket.disconnect();
			socket.emit('reload');  // Reload will display 404 page. A bit hacky, but works for now...
		}

	});

});






server.listen(program.port, function () {

	console.log('Listening on port %s...', program.port);

});





