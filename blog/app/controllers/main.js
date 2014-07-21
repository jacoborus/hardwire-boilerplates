'use strict';

exports.wiretree = function () {

	var mod = {};

	mod.index =  function (req, res, next) {
		res.render('index', {
			title: 'Hardwire',
			data: {},
			contacto: {}
		});
	};

	mod.login =  function (req, res, next) {
		res.render('login', {
			title: 'Login'
		});
	};

	mod.contacto =  function (req, res, next) {
		res.render( 'contact', {
			title: 'Contact'
		});
	};

	return mod;
};
