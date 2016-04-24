'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var babel = require('babelify');
var fs = require('fs');

// add custom browserify options here
var customOpts = {
    entries: ['./src/app.js'],
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)).transform(babel, {presets: ["es2015", "react"]});

// add transformations here
// i.e. b.transform(coffeeify)

console.log(process.env.PRODUCTION);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
if(!process.env.PRODUCTION)
    b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal



function bundle() {
    fs.readFile('./src/config.js.tmpl', 'utf8', function(err, data) {
	
	fs.writeFile('./src/config.js', data.replace('${url}', (function() {
	    if(process.env.PRODUCTION) {
		return "/";
	    }
	    return "http://localhost:3000";
	})()), { encoding : "utf8", flag: "w"});
    })
    if(!process.env.PRODUCTION) {
	
	return b.bundle()
	// log errors if they happen
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
            .pipe(buffer())
	// optional, remove if you dont want sourcemaps
            .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
	// Add transformation tasks to the pipeline here.
            .pipe(sourcemaps.write('./')) // writes .map file
            .pipe(gulp.dest('./dist'));
    }
    return browserify({entries: ['./src/app.js']}).transform(babel, {presets: ["es2015", "react"]})
	.bundle()
    // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist'));
    
}'use strict';
