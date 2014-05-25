(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../../../bower_components/nanobar":2,"../../../bower_components/submitter/submitter":3}],2:[function(require,module,exports){
/* http://nanobar.micronube.com/  ||  https://github.com/jacoborus/nanobar/    MIT LICENSE */
var Nanobar = (function () {

	'use strict';
	var addCss, Bar, Nanobar, move, place, init,
		// container styles
		cssCont = {
			width: '100%',
			height: '4px',
			zIndex: 9999,
			top : '0'
		},
		// bar styles
		cssBar = {
			width:0,
			height: '100%',
			clear: 'both',
			transition: 'height .3s'
		};


	// add `css` to `el` element
	addCss = function (el, css ) {
		var i;
		for (i in css) {
			el.style[i] = css[i];
		}
		el.style.float = 'left';
	};

	// animation loop
	move = function () {
		var self = this,
			dist = this.width - this.here;

		if (dist < 0.1 && dist > -0.1) {
			place.call( this, this.here );
			this.moving = false;
			if (this.width == 100) {
				this.el.style.height = 0;
				setTimeout( function () {
					self.cont.el.removeChild( self.el );
				}, 300);
			}
		} else {
			place.call( this, this.width - (dist/4) );
			setTimeout( function () {
				self.go();
			}, 16);
		}
	};

	// set bar width
	place = function (num) {
		this.width = num;
		this.el.style.width = this.width + '%';
	};

	// create and insert bar in DOM and this.bars array
	init = function () {
		var bar = new Bar( this );
		this.bars.unshift( bar );
	};

	Bar = function ( cont ) {
		// create progress element
		this.el = document.createElement( 'div' );
		this.el.style.backgroundColor = cont.opts.bg;
		this.width = 0;
		this.here = 0;
		this.moving = false;
		this.cont = cont;
		addCss( this.el, cssBar);
		cont.el.appendChild( this.el );
	};

	Bar.prototype.go = function (num) {
		if (num) {
			this.here = num;
			if (!this.moving) {
				this.moving = true;
				move.call( this );
			}
		} else if (this.moving) {
			move.call( this );
		}
	};


	Nanobar = function (opt) {

		var opts = this.opts = opt || {},
			el;

		// set options
		opts.bg = opts.bg || '#000';
		this.bars = [];


		// create bar container
		el = this.el = document.createElement( 'div' );
		// append style
		addCss( this.el, cssCont);
		if (opts.id) {
			el.id = opts.id;
		}
		// set CSS position
		el.style.position = !opts.target ? 'fixed' : 'relative';

		// insert container
		if (!opts.target) {
			document.getElementsByTagName( 'body' )[0].appendChild( el );
		} else {
			opts.target.insertBefore( el, opts.target.firstChild);
		}

		init.call( this );
	};


	Nanobar.prototype.go = function (p) {
		// expand bar
		this.bars[0].go( p );

		// create new bar at progress end
		if (p == 100) {
			init.call( this );
		}
	};

	return Nanobar;
})();

module.exports = Nanobar;

},{}],3:[function(require,module,exports){
(function() {
	var submitter = function (fName, options) {

		var form, getValues, upload, opts, buttons, bLen, j, btn;

		opts = options || {}
		opts.init = opts.init || function () {};
		opts.progress = opts.progress || function (p) {};
		opts.finish = opts.finish || function () {};
		opts.fail = opts.fail || function (err) { console.log( err );};
		opts.success = opts.success || function (data) {console.log( data );};

		/**
		 * Get form values
		 * @param  {Object} form  target form
		 * @return {Object}       object with form values
		*/

		getValues = function (form) {
			var data, i, inputs, textareas, _editables, x, len;

			inputs = form.elements;
			data = new FormData();

			// store values
			for (i = 0, len = inputs.length; i < len; i++) {
				x = inputs[i];
				switch (x.type) {
					// file inputs
					case 'file':
						// check if contain files
						if (x.files && x.files.length !== 0) {
							// on single file
							if (x.files.length === 1) {
								data.append(x.name, x.files[0]);
							// more than one file
							} else {
								data.append(x.name, x.files);
							}
						};
						break;
					// inputs with multiple instances
					case 'radio':
					case 'checkbox':
						if (x.checked) {
							data.append( x.name, x.value);
						}
						break;
	                // regular inputs
	                default:
	                    if (inputs.hasOwnProperty(i)) {
	                        data.append(x.name, x.value);
	                    };
	                    break;
				}
			}

			_eds = form.getElementsByClassName('editable');
			for (i = 0, len = _eds.length; i < len; i++) {

				if (_eds.hasOwnProperty( i )) {
					data.append( _eds[i].attributes.name.value, _eds[i].innerHTML );
				}
			}

			return data;
		};

		upload = function (form) {
			var data, request, _URL;
			// target url
			_URL = form.action;
			// recover all data
			data = getValues(form);

			request = new XMLHttpRequest();

			request.onreadystatechange = function() {
				var e, resp;
				if (request.readyState === 1) {
					opts.init();
				}
				if (request.readyState === 4) {
					try {
						return resp = JSON.parse(request.response);
					} catch (_error) {
						e = _error;
						resp = {
							status: 'error',
							data: 'Unknown error occurred: [' + request.responseText + ']'
						};
						opts.fail(resp);
					}
				}
			};

			request.upload.addEventListener( 'progress', function (e) {
				return opts.progress( (e.loaded / e.total) * 100);
			}, false);

			request.onload = function () {
				return opts.success(this.responseText);
			};

			request.addEventListener( "error", function (e) {
				console.log('falló');
				return opts.fail( e );
			}, false );

			request.open('POST', _URL);
			return request.send(data);
		};

		form = document.forms[fName];

		// Allow external submit buttons
		buttons = document.getElementsByTagName('input');

		for (j = 0, bLen = buttons.length; j < bLen; j++){

			if (buttons[j].attributes.target && buttons[j].attributes.target.value === fName && buttons[j].attributes.type.value === 'submit') {
				buttons[j].onclick = function (e) {
					upload(form);
					return e.preventDefault();
				}
			}
		}

		// create inputs with type:file for images with attribute submmiter
		var formImgs = form.getElementsByTagName('img');
		var inp;
		for (j = 0, bLen = formImgs.length; j < bLen; j++){

			if (formImgs[j].attributes.submitter && formImgs[j].attributes.name) {
				// create input and set attributes
				inp = document.createElement( 'input' );
				inp.setAttribute( 'name', formImgs[j].attributes.name.value );
				inp.setAttribute( 'type', 'file' );
				inp.img = formImgs[j];
				inp.style.display = 'none';
				formImgs[j].inp = inp;

				inp.addEventListener( 'change', function (e) {
					var files = e.target.files || e.dataTransfer.files;
					var reader = new FileReader();
					var _this = e.target;

					reader.onload = function (e) {
						_this.img.src = e.target.result;
					};
					reader.readAsDataURL(files[0]);
				}, false);

				formImgs[j].onclick = function (e) {
					event = new Event('click');
					e.target.inp.dispatchEvent(event);
				}

				form.appendChild(inp);
			}
		}


		// Form binding
		return form.addEventListener( 'submit', function (evt) {
			evt.preventDefault();
			return upload( form );
		});
	};

	// node.js
	if((typeof module != 'undefined') && (typeof module.exports != 'undefined')) {
		module.exports = submitter;
	// browser
	} else if(typeof window != 'undefined') {
		window.submitter = submitter;
	}
})();
},{}]},{},[1])