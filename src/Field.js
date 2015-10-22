'use strict';

const assert = require('assert');

const VALID_TYPES = [
	'hidden',
	'text',
	'search',
	'tel',
	'url',
	'email',
	'password',
	'datetime',
	'date',
	'month',
	'week',
	'time',
	'datetime-local',
	'number',
	'range',
	'color',
	'checkbox',
	'radio',
	'file'
];

function Field(field) {
	assert('object' === typeof field);
	assert('string' === typeof field.name);
	assert('undefined' === typeof field.class || Array.isArray(field.class));
	assert('undefined' === typeof field.type
		|| ('string' === typeof field.type && VALID_TYPES.indexOf(field.type.toLowerCase()) > -1));
	assert('undefined' === typeof field.title || 'string' === typeof field.title);

	this.name = field.name;

	if (field.class) {
		this.class = field.class;
	}

	if (field.type) {
		this.type = field.type;
	}

	if (field.value) {
		this.value = field.value;
	}

	if (field.title) {
		this.title = field.title;
	}
}

Field.prototype.hasClass = function(cls) {
	return this.class instanceof Array && this.class.indexOf(cls) > -1;
};

module.exports = Field;
