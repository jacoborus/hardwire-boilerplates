'use strict';

var $cl, $id, $ajax, Nanobar, editor, nanobar, options, submitter, delBtns;

submitter = require('../../../bower_components/submitter/submitter');

Nanobar = require('../../../bower_components/nanobar');

$id = function(id) {
	return document.getElementById(id);
};

$cl = function(cl) {
	return document.getElementsByClassName(cl);
};

$ajax = function (type, url, callback) {
	var request = new XMLHttpRequest();
	request.open(type, url, true);

	request.onload = function () {
		if (this.status >= 200 && this.status < 400) {
			// Success!
			callback( null, this.response);
		} else {
			// We reached our target server, but it returned an error
			callback( 'connection error' );
		}
	};

	request.onerror = function () {
		callback( 'fail' );
	};

	request.send();
};

nanobar = new Nanobar({
	bg: '#f47216'
});

options = {
	init: function () {},
	finish: function () {
		nanobar.go(100);
	},
	progress: function (p) {
		nanobar.go(p);
	},
	fail: function (e) {
		nanobar.go(100);
		alert('Ups! error transfiriendo datos');
	},
	success: function (data) {
		console.log(data);
		nanobar.go(100);
	}
};

if (document.querySelector( 'form[name="mainform"]' ) !== null) {
	submitter('mainform', options);
}

delBtns = document.querySelector('table tbody tr a.deleteDoc') || {};

Array.prototype.forEach.call( delBtns, function (el, index) {
	var donde = el.getAttribute( 'href' );
	el.addEventListener(
	    'click',
	    function (e) {
			var r;
			e.preventDefault();
			r = confirm('¿Are you sure?');
			if (r) {
				$ajax( 'DELETE', donde, function (err, result) {
					if (err) {
						console.log( err );
					} else {
						console.log(result);
						if (result.res === true) {
							return location.reload();
						} else {
							return alert('error, no encontrado');
						}
					}
				});
			}
		}
	);
});

var mds = document.querySelector( '.md' );
if (mds) {
	mds.markdown({
		autofocus: false,
		savable: false
	});
}

document.querySelector( '#menu-toggle' ).addEventListener( 'click', function(e) {
	e.preventDefault();
	document.querySelector('#wrapper').classList.remove('active');
});
