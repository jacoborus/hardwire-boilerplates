'use strict';

module.exports.wiretree = function (app, express, models, control) {

	/*
	 * GENERAL  ----------------------------------------
	 */
	app.route('/').get( control.main.index );
	app.route('/contact').get( control.main.contact );

	/*
	 * BLOG  ----------------------------------------
	 */
	app.route( '/blog' ).get( control.blog.index );
	app.route( '/blog/:note' ).get( control.blog.single );

	return true;
};
