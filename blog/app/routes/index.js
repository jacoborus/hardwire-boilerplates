'use strict';

module.exports.wiretree = function (app, express, models, control) {

	/*
	 * GENERAL  ----------------------------------------
	 */
	app.route('/').get( control.main.index );

	/*
	 * BLOG  ----------------------------------------
	 */
	app.route('/blog').get( control.blog.index );
	app.route('/blog/:slug').get( control.blog.single );

	return true;
};
