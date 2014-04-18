
var fs = require('fs'),
	_ = require('lodash'),
	connect = require('connect'),
	serveStatic = require('serve-static'),
	gulp = require('gulp'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	markdown = require('gulp-markdown'),
	livereload = require('gulp-livereload'),
	args = process.argv.slice(2);




// Stub process.stdout.write
var stdout_write = process.stdout.write;
process.stdout.write = function () {}

// Restore process.stdout.write
//process.stdout.write = stdout_write;



var LOG = function (value) {

	if (stdout_write)
		process.stdout.write = stdout_write;

	console.log.apply(this, arguments);

	stdout_write = process.stdout.write;

	process.stdout.write = function () {}

}





// Check for http folder
if (!fs.existsSync('http'))
	fs.mkdirSync('http');


var app = connect();
app.use( serveStatic('http') );
app.use(function (req, res) {
	res.statusCode = 404;
	res.end('Unknown resource!');
});
app.listen(8080);


var files = _.filter(args, fs.existsSync);
gulp.src(files, { read: false })
	.pipe( watch() )
	.pipe( plumber() )
	.pipe( markdown() )
	.pipe( gulp.dest('http') )
	.pipe( livereload() )
	//.on('data', function () {
	//	LOG('DATA!');
	//});


LOG('Listening...');

