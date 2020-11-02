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

	Object.assign(this, field);
}

Field.prototype.toJSON = function() {
	return Object.assign({}, this);
};

Field.prototype.hasClass = function(cls) {
	return this.class instanceof Array && contains(this.class, cls);
};
