'use strict';

module.exports = function(expectation, msg) {
	if (!expectation) {
		throw new Error(msg);
	}
};
