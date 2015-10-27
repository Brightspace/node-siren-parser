'use strict';

const
	assert = require('assert'),
	Action = require('./Action'),
	Entity = require('./Entity');

function parseSiren(res, fn) {
	if ('string' === typeof res) {
		return new Entity(res);
	}
	res.text = '';
	res.setEncoding('utf8');
	res.on('data', function(chunk) { res.text += chunk; });
	res.on('end', function() {
		let err, body;
		try {
			body = new Entity(res.text);
		} catch (e) {
			err = e;
		} finally {
			fn(err, body);
		}
	});
}

function submitHelper(req) {
	req.submit = function submit(data) {
		assert('object' === typeof data);
		if ('GET' === this.method.toUpperCase()) {
			this.query(data);
		} else {
			this.send(data);
		}
		return this;
	};
}

function performAction(request, action) {
	assert(request);
	assert(action instanceof Action);
	return request[action.method.toLowerCase()](action.href)
		.use(submitHelper)
		.type(action.type)
		.submit(action.extendFields());
}

module.exports = {
	parse: parseSiren,
	perform: performAction,
	submitHelper: submitHelper
};
