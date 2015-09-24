'use strict';

const assert = require('assert');

function Action (action) {
	assert('object' === typeof action);
	assert('string' === typeof action.name);
	assert('string' === typeof action.href);
	assert('undefined' === typeof action.class || Array.isArray(action.class));
	assert('undefined' === typeof action.method || 'string' === typeof action.method);
	assert('undefined' === typeof action.title || 'string' === typeof action.title);
	assert('undefined' === typeof action.type || 'string' === typeof action.type);
	assert('undefined' === typeof action.fields || Array.isArray(action.fields));

	this.name = action.name;
	this.href = action.href;

	if (action.class) {
		this.class = action.class;
	}

	if (action.method) {
		this.method = action.method;
	}

	if (action.title) {
		this.title = action.title;
	}

	if (action.type) {
		this.type = action.type;
	}

	if (action.fields) {
		this.fields = action.fields;
	}
}

module.exports = Action;
