import assert from './assert';
import {contains} from './util';

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

export default function Field(field) {
	if (field instanceof Field) {
		return field;
	}
	if (!(this instanceof Field)) {
		return new Field(field);
	}

	assert('object' === typeof field, 'field must be an object, got ' + JSON.stringify(field));
	assert('string' === typeof field.name, 'field.name must be a string, got ' + JSON.stringify(field.name));
	assert('undefined' === typeof field.class || Array.isArray(field.class),
		'field.class must be an array or undefined, got ' + JSON.stringify(field.class));
	assert('undefined' === typeof field.type || ('string' === typeof field.type && VALID_TYPES.indexOf(field.type.toLowerCase()) > -1),
		'field.type must be a valid field type string or undefined, got ' + JSON.stringify(field.type));
	assert('undefined' === typeof field.title || 'string' === typeof field.title,
		'field.title must be a string or undefined, got ' + JSON.stringify(field.title));
	assert('undefined' === typeof field.min || 'number' === typeof field.min,
		'field.min must be a number or undefined, got ' + JSON.stringify(field.min));
	assert('undefined' === typeof field.max || 'number' === typeof field.max,
		'field.min must be a number or undefined, got ' + JSON.stringify(field.max));

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

	if (field.min) {
		this.min = field.min;
	}

	if (field.max) {
		this.max = field.max;
	}
}

Field.prototype.toJSON = function() {
	return {
		name: this.name,
		class: this.class,
		type: this.type,
		value: this.value,
		title: this.title,
		min: this.min,
		max: this.max
	};
};

Field.prototype.hasClass = function(cls) {
	return this.class instanceof Array && contains(this.class, cls);
};
