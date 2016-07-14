'use strict';

const
	assert = require('./assert'),
	util = require('./util');

function Link(link) {
	if (link instanceof Link) {
		return link;
	}
	if (!(this instanceof Link)) {
		return new Link(link);
	}

	assert('object' === typeof link, 'link must be an object');
	assert(Array.isArray(link.rel), 'link.rel must be an array');
	assert('string' === typeof link.href, 'link.href must be a string');
	assert('undefined' === typeof link.class || Array.isArray(link.class),
		'link.class must be an array or undefined');
	assert('undefined' === typeof link.title || 'string' === typeof link.title,
		'link.title must be a string or undefined');
	assert('undefined' === typeof link.type || 'string' === typeof link.type,
		'link.type must be a string or undefined');

	this.rel = link.rel;
	this.href = link.href;

	if (link.class) {
		this.class = link.class;
	}

	if (link.title) {
		this.title = link.title;
	}

	if (link.type) {
		this.type = link.type;
	}
}

Link.prototype.hasClass = function(cls) {
	return this.class instanceof Array && util.contains(this.class, cls);
};

module.exports = Link;
