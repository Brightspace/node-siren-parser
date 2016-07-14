'use strict';

const
	assert = require('./assert'),
	util = require('./util');

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
	if (field instanceof Field) {
		return field;
	}
	if (!(this instanceof Field)) {
		return new Field(field);
	}

	assert('object' === typeof field, 'field must be an object');
	assert('string' === typeof field.name, 'field.name must be a string');
	assert('undefined' === typeof field.class || Array.isArray(field.class),
		'field.class must be an array or undefined');
	assert('undefined' === typeof field.type
		|| ('string' === typeof field.type && VALID_TYPES.indexOf(field.type.toLowerCase()) > -1),
		'field.type must be a valid field type string or undefined');
	assert('undefined' === typeof field.title || 'string' === typeof field.title,
		'field.title must be a string or undefined');

	this.name = field.name;

	if (field.class) {
		this.class = field.class;
	}

	if (field.type) {
		this.type = field.type;
	}

	if (field.hasOwnProperty('value')) {
		this.value = field.value;
	}

	if (field.title) {
		this.title = field.title;
	}
}

Field.prototype.hasClass = function(cls) {
	return this.class instanceof Array && util.contains(this.class, cls);
};

module.exports = Field;
