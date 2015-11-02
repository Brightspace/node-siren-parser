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

// Siren doesn't specify what to do if there are any fields with the same name
// (ie. radio buttons). If this happens, the first such field in the list will be chosen
function flattenFields(fields) {
	const fieldsObj = {};
	fields.forEach(function(field) {
		if (!fields.hasOwnProperty(field.name)) {
			fieldsObj[field.name] = field.value;
		}
	});
	return fieldsObj;
}

function submitHelper(req) {
	req.submit = function submit(fields) {
		if (Array.isArray(fields)) {
			fields = flattenFields(fields);
		}

		switch (this.method.toUpperCase()) {
			case 'GET':
			case 'HEAD': {
				return this.query(fields);
			}
			default: {
				return this.send(fields);
			}
		}
	};
}

function performAction(request, action) {
	assert(request);
	assert(action instanceof Action);
	return request[action.method.toLowerCase()](action.href)
		.use(submitHelper)
		.type(action.type)
		.submit(action.fields || []);
}

module.exports = {
	parse: parseSiren,
	perform: performAction
};
