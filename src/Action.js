'use strict';

const
	assert = require('assert'),
	Field = require('./Field');

function Action (action) {
	const self = this;

	assert('object' === typeof action);
	assert('string' === typeof action.name);
	assert('string' === typeof action.href);
	assert('undefined' === typeof action.class || Array.isArray(action.class));
	assert('undefined' === typeof action.method || 'string' === typeof action.method);
	assert('undefined' === typeof action.title || 'string' === typeof action.title);
	assert('undefined' === typeof action.type || 'string' === typeof action.type);
	assert('undefined' === typeof action.fields || Array.isArray(action.fields));

	self.name = action.name;
	self.href = action.href;

	if (action.class) {
		self.class = action.class;
	}

	if (action.method) {
		self.method = action.method;
	}

	if (action.title) {
		self.title = action.title;
	}

	if (action.type) {
		self.type = action.type;
	}

	self.fieldsByName = {};
	if (action.fields) {
		self.fields = [];
		action.fields.forEach(function (field) {
			const fieldInstance = new Field(field);
			self.fields.push(fieldInstance);
			self.fieldsByName[field.name] = fieldInstance;
		});
		self.fields = action.fields;
	}
}

Action.prototype.getField = function (fieldName) {
	return this.fieldsByName[fieldName];
};

module.exports = Action;
