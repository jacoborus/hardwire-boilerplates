
// load dependencies
var Datastore = require('nedb'),
	mailTemplates = require('./data/mail_templates');


var maildb = new Datastore({
	filename: __dirname + '/../../data/db/mail_templates.json',
	autoload: true
});


addTemplate = function (nombre, plantilla) {
	plantilla.slug = nombre;
	maildb.update({slug: nombre}, plantilla, {upsert: true}, function (err, num, doc) {
		if (err) {
			console.log( err );
		} else {
			console.log('Plantilla guardada: ' + nombre);
		}
	});
}

// Add/update templates
var i;
for (i in mailTemplates) {
	addTemplate( i, mailTemplates[i] );
}

