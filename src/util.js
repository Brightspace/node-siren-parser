export function contains(arrayLike, stringOrRegex) {
	if (!stringOrRegex) {
		return false;
	}

	if ('string' === typeof stringOrRegex) {
		return arrayLike.indexOf(stringOrRegex) > -1;
	}

	let match;
	for (let i = 0; i < arrayLike.length; i++) {
		if (arrayLike[i].match(stringOrRegex)) {
			match = arrayLike[i].match(stringOrRegex);
			break;
		}
	}

	return (match !== undefined);
}

export function hasProperty(objectLike, stringOrRegex) {
	if ('string' === typeof stringOrRegex) {
		return Object.prototype.hasOwnProperty.call(objectLike, stringOrRegex);
	}

	return contains(Object.keys(objectLike), stringOrRegex);
}

export function getMatchingValue(objectLike, stringOrRegex) {
	if (!stringOrRegex) {
		return;
	}

	if ('string' === typeof stringOrRegex) {
		return objectLike[stringOrRegex];
	}

	const keys = Object.keys(objectLike);
	for (var i = 0; i < keys.length; i++) {
		const key = keys[i];

		if (key.match(stringOrRegex)) {
			return objectLike[key];
		}
	}
}

export function getMatchingValuesByAll(arrayLike, arrayOfStringOrRegex, propertyToMatch) {
	if (!Array.isArray(arrayLike) || !Array.isArray(arrayOfStringOrRegex) || !propertyToMatch) {
		return [];
	}

	const results = [];
	for (var i = 0; i < arrayLike.length; i++) {
		var like = arrayLike[i];
		var val = like[propertyToMatch];

		if (val && arrayOfStringOrRegex.every(
			function(y) {
				return contains(val, y);
			})
		) {
			results.push(like);
		}
	}

	return results;
}
