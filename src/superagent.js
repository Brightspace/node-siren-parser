'use strict';

const
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

module.exports = {
	parse: parseSiren
};
