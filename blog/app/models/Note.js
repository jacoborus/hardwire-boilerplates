'use strict';

var safename = require('safename'),
	Schema;

exports.wiretree = function (mongoose) {

	Schema = mongoose.Schema;
	/*
		Note Schema -----------------------
	 */
	var NoteSchema;
	NoteSchema = new Schema({
		title: {
			type: String,
			required: true
		},
		updated: {
			type: Date
		},
		date: {
			type: Date,
			required: true,
			default: new Date()
		},
		slug: {
			type: String,
			required: true
		},
		entry: String,
		image: String
	});


	/*
		Pre-save hooks --------------------------------------------------------------------------
	 */
	NoteSchema.pre( 'validate', function (next) {
		this.slug = safename( this.title );
		this.updated = new Date();
		next();
	});

	return mongoose.model( 'Note', NoteSchema );
};

