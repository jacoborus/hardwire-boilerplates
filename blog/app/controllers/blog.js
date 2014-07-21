'use strict';

exports.wiretree = function (app, models, Note) {

	var mod = {};

	mod.index =  function (req, res, next) {
		Note.find()
		.exec( function (err, data) {
			if (err) {throw(err)};
			res.render( 'blog', {
				title: 'subStuff',
				data: data
			});
		});
	};

	mod.single =  function (req, res, next) {
		Note.find({slug: req.params.slug})
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
