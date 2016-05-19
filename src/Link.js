'use strict';

const assert = require('./assert');

function Link(link) {
	if (link instanceof Link) {
		return link;
	}
	if (!(this instanceof Link)) {
		return new Link(link);
	}

	assert('object' === typeof link);
	assert(Array.isArray(link.rel));
	assert('string' === typeof link.href);
	assert('undefined' === typeof link.class || Array.isArray(link.class));
	assert('undefined' === typeof link.title || 'string' === typeof link.title);
	assert('undefined' === typeof link.type || 'string' === typeof link.type);

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
	return this.class instanceof Array && this.class.indexOf(cls) > -1;
};

module.exports = Link;
