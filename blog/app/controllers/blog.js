'use strict';

exports.wiretree = function (app, models, Blog) {

	var mod = {};

	mod.index =  function (req, res, next) {
		Blog.find()
		.exec( function (err, data) {
			if (err) {throw(err)};
			res.render( 'blog', {
				title: 'subStuff',
				data: data
			});
		});
	};

	mod.single =  function (req, res, next) {
		Blog.find({slug: req.params.slug})
		.exec( function (err, data) {
			if (err) {throw(err)};
			res.render( 'single', {
				title: 'subStuff',
				data: data[0]
			});
		});
	};

	return mod;
};
