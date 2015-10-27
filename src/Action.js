'use strict';

const
	assert = require('assert'),
	Field = require('./Field');

function Action(action) {
	if (!(this instanceof Action)) {
		return new Action(action);
	}
	if (action instanceof Action) {
		return action;
	}
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

	self.method = action.method || 'GET';

	if (action.title) {
		self.title = action.title;
	}

	self.type = action.type || 'application/x-www-form-urlencoded';

	self._fieldsByName = {};
	if (action.fields) {
		self.fields = [];
		action.fields.forEach(function(field) {
			const fieldInstance = new Field(field);
			self.fields.push(fieldInstance);
			self._fieldsByName[field.name] = fieldInstance;
		});
		self.fields = action.fields;
	}
}

Action.prototype.hasClass = function(cls) {
	return this.class instanceof Array && this.class.indexOf(cls) > -1;
};

Action.prototype.hasField = function(fieldName) {
	return this._fieldsByName.hasOwnProperty(fieldName);
};

Action.prototype.getField = function(fieldName) {
	return this._fieldsByName[fieldName];
};

module.exports = Action;
