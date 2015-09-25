'use strict';

const assert = require('assert');

const
	Action = require('./Action'),
	Link = require('./Link');

function Entity (entity) {
	if (!(this instanceof Entity)) {
		return new Entity(entity);
	}

	if ('object' !== typeof entity) {
		entity = JSON.parse(entity);
	}

	const self = this;

	assert('undefined' === typeof entity.rel || Array.isArray(entity.rel));
	assert('undefined' === typeof entity.title || 'string' === typeof entity.title);
	assert('undefined' === typeof entity.type || 'string' === typeof entity.type);
	assert('undefined' === typeof entity.properties || 'object' === typeof entity.properties);
	assert('undefined' === typeof entity.class || Array.isArray(entity.class));
	assert('undefined' === typeof entity.actions || Array.isArray(entity.actions));
	assert('undefined' === typeof entity.links || Array.isArray(entity.links));
	assert('undefined' === typeof entity.entities || Array.isArray(entity.entities));

	if (entity.rel) {
		// Only applies to sub-entities (required for them)
		self.rel = entity.rel;
	}

	if (entity.title) {
		self.title = entity.title;
	}

	if (entity.type) {
		self.type = entity.type;
	}

	if (entity.properties) {
		self.properties = entity.properties;
	}

	if (entity.class) {
		self.class = entity.class;
	}

	self.actionsByName = {};
	if (entity.actions) {
		self.actions = [];
		entity.actions.forEach(function (action) {
			const actionInstance = new Action(action);
			self.actions.push(actionInstance);
			self.actionsByName[action.name] = actionInstance;
		});
	}

	self.linksByRel = {};
	if (entity.links) {
		self.links = [];
		entity.links.forEach(function (link) {
			const linkInstance = new Link(link);
			self.links.push(linkInstance);

			link.rel.forEach(function (rel) {
				self.linksByRel[rel] = linkInstance;
			});
		});
	}

	self.entitiesByRel = {};
	if (entity.entities) {
		self.entities = [];
		entity.entities.forEach(function (subEntity) {
			assert(Array.isArray(subEntity.rel));

			let subEntityInstance;
			if ('string' === typeof subEntity.href) {
				subEntityInstance = new Link(subEntity);
			} else {
				subEntityInstance = new Entity(subEntity);
			}
			self.entities.push(subEntityInstance);

			subEntity.rel.forEach(function (rel) {
				self.entitiesByRel[rel] = subEntityInstance;
			});
		});
	}
}

Entity.prototype.getAction = function (actionName) {
	return this.actionsByName[actionName];
};

Entity.prototype.getLink = function (linkRel) {
	return this.linksByRel[linkRel];
};

Entity.prototype.getSubEntity = function (entityRel) {
	return this.entitiesByRel[entityRel];
};

module.exports = Entity;
