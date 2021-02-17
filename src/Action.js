import assert from './assert';
import { contains, getMatchingValue, getMatchingValuesByAll, hasProperty } from './util.js';
import Field from './Field';

export default function Action(action) {
	if (action instanceof Action) {
		return action;
	}
	if (!(this instanceof Action)) {
		return new Action(action);
	}

	assert('object' === typeof action, 'action must be an object, got ' + JSON.stringify(action));
	assert('string' === typeof action.name, 'action.name must be a string, got ' + JSON.stringify(action.name));
	assert('string' === typeof action.href, 'action.href must be a string, got ' + JSON.stringify(action.href));
	assert('undefined' === typeof action.class || Array.isArray(action.class),
		'action.class must be an array or undefined, got ' + JSON.stringify(action.class));
	assert('undefined' === typeof action.method || 'string' === typeof action.method,
		'action.method must be a string or undefined, got ' + JSON.stringify(action.method));
	assert('undefined' === typeof action.title || 'string' === typeof action.title,
		'action.title must be a string or undefined, got ' + JSON.stringify(action.title));
	assert('undefined' === typeof action.type || 'string' === typeof action.type,
		'action.type must be a string or undefined, got ' + JSON.stringify(action.type));
	assert('undefined' === typeof action.fields || Array.isArray(action.fields),
		'action.fields must be an array or undefined, got ' + JSON.stringify(action.fields));

	this.name = action.name;
	this.href = action.href;

	if (action.class) {
		this.class = action.class;
	}

	this.method = action.method || 'GET';

	if (action.title) {
		this.title = action.title;
	}

	this.type = action.type || 'application/x-www-form-urlencoded';

	this._fieldsByName = {};
	this._fieldsByClass = {};
	this._fieldsByType = {};
	if (action.fields) {
		this.fields = [];

		action.fields.forEach(field => {
			const fieldInstance = new Field(field);
			this.fields.push(fieldInstance);

			this._fieldsByName[field.name] = fieldInstance;

			if (fieldInstance.type) {
				this._fieldsByType[fieldInstance.type] = this._fieldsByType[fieldInstance.type] || [];
				this._fieldsByType[fieldInstance.type].push(fieldInstance);
			}

			if (fieldInstance.class) {
				fieldInstance.class.forEach(cls => {
					this._fieldsByClass[cls] = this._fieldsByClass[cls] || [];
					this._fieldsByClass[cls].push(fieldInstance);
				});
			}
		});
	}
}

Action.prototype.toJSON = function() {
	return {
		name: this.name,
		href: this.href,
		class: this.class,
		method: this.method,
		title: this.title,
		type: this.type,
		fields: this.fields
	};
};

Action.prototype.hasClass = function(cls) {
	return this.class instanceof Array && contains(this.class, cls);
};

Action.prototype.hasField = function(fieldName) {
	return this.hasFieldByName(fieldName);
};

Action.prototype.hasFieldByName = function(fieldName) {
	return hasProperty(this._fieldsByName, fieldName);
};

Action.prototype.hasFieldByClass = function(fieldClass) {
	return hasProperty(this._fieldsByClass, fieldClass);
};

Action.prototype.hasFieldByType = function(fieldType) {
	return hasProperty(this._fieldsByType, fieldType);
};

Action.prototype.getField = function(fieldName) {
	return this.getFieldByName(fieldName);
};

Action.prototype.getFieldByName = function(fieldName) {
	return getMatchingValue(this._fieldsByName, fieldName);
};

Action.prototype.getFieldByClass = function(fieldClass) {
	const vals = getMatchingValue(this._fieldsByClass, fieldClass);
	return vals ? vals[0] : undefined;
};

Action.prototype.getFieldsByClass = function(fieldClass) {
	const vals = getMatchingValue(this._fieldsByClass, fieldClass);
	return vals ? vals.slice() : [];
};

Action.prototype.getFieldByClasses = function(fieldClasses) {
	const vals = getMatchingValuesByAll(this.fields, fieldClasses, 'class');
	return vals && vals.length > 0 ? vals[0] : undefined;
};

Action.prototype.getFieldsByClasses = function(fieldClasses) {
	const vals = getMatchingValuesByAll(this.fields, fieldClasses, 'class');
	return vals && vals.length > 0 ? vals.slice() : [];
};

Action.prototype.getFieldByType = function(fieldType) {
	const vals = getMatchingValue(this._fieldsByType, fieldType);
	return vals ? vals[0] : undefined;
};

Action.prototype.getFieldsByType = function(fieldType) {
	const vals = getMatchingValue(this._fieldsByType, fieldType);
	return vals ? vals.slice() : [];
};
