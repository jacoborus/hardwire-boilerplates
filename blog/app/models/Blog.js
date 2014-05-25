'use strict';

var safename = require('safename'),
	Schema;

exports.wiretree = function (mongoose) {

	Schema = mongoose.Schema;
	/*
		Blog Schema -----------------------
	 */
	var BlogSchema;
	BlogSchema = new Schema({
		title: {
			type: String,
			required: true
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
		photo: String,
		imagen: String
	});


	/*
		Pre-save hooks --------------------------------------------------------------------------
	 */
	BlogSchema.pre( 'validate', function (next) {
		this.slug = safename( this.title );
		next();
	});

	return mongoose.model('Blog', BlogSchema);
};

