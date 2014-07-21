var gulp = require('gulp'),
	browserify = require('gulp-browserify'),
	concat = require('gulp-concat'),
	stylus = require('gulp-stylus'),
	jshint = require( 'gulp-jshint' ),
	rename = require('gulp-rename'),
	stylish = require('jshint-stylish'),
	uglify = require('gulp-uglify'),
	newer = require('gulp-newer');


// Get all .styl files in one folder and render
gulp.task( 'styles', function () {

	var stream = gulp.src( './app/src/css/*.styl' )
		.pipe(newer({
			dest: './app/public/css',
			ext: '.css'
		}))
		.pipe( stylus({ use: ['nib'] }))
		.pipe( gulp.dest( './app/public/css' ));
	return stream;
});

// Get all .css files in one folder and render
gulp.task( 'copyCSS', function () {

	var stream = gulp.src( './app/src/css/*.css' )
		.pipe( gulp.dest( './app/public/css' ));
	return stream;
});


// Browserify client
gulp.task( 'scripts', function () {
	// Single entry point to browserify
	var stream = gulp.src( './app/src/js/*.js' )
		.pipe( browserify())
		.pipe( gulp.dest( './app/public/js' ));
	return stream;
});


// Browserify client
gulp.task( 'min', function () {
	// Single entry point to browserify
	var stream = gulp.src( './app/src/js/*.js' )
		.pipe( uglify())
		.pipe( rename( function (path) {
			path.basename += ".min";
		}))
		.pipe( gulp.dest( './app/public/js/min' ));
	return stream;
});


// JS hint task
gulp.task( 'jshint', function() {
	var stream = gulp.src('./app/src/js/*.js')
		.pipe( jshint())
		.pipe( jshint.reporter( stylish ));
	return stream;
});

// dev mode: watch front-end source files
gulp.task( 'dev', [ 'styles', 'copyCSS', 'jshint', 'scripts'], function() {
	gulp.watch( './app/src/js/**/*.js', ['jshint', 'scripts'] );
	gulp.watch( './app/src/css/**/*.styl', ['styles'] );
});


// dev mode: watch front-end source files
gulp.task( 'build', ['styles', 'copyCSS','jshint', 'scripts', 'min'] );


