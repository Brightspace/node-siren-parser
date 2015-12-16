'use strict';

const assert = require('assert');

const
	Action = require('./Action'),
	Link = require('./Link');

function Entity(entity) {
	if (entity instanceof Entity) {
		return entity;
	}
	if (!(this instanceof Entity)) {
		return new Entity(entity);
	}

	if ('object' !== typeof entity) {
		entity = JSON.parse(entity);
	}

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
		this.rel = entity.rel;
	}

	if (entity.title) {
		this.title = entity.title;
	}

	if (entity.type) {
		this.type = entity.type;
	}

	if (entity.properties) {
		this.properties = entity.properties;
	}

	if (entity.class) {
		this.class = entity.class;
	}

	this._actionsByName = {};
	this._actionsByClass = {};
	this._actionsByMethod = {};
	this._actionsByType = {};
	if (entity.actions) {
		this.actions = [];
		entity.actions.forEach(action => {
			const actionInstance = new Action(action);
			this.actions.push(actionInstance);
			this._actionsByName[actionInstance.name] = actionInstance;

			if (actionInstance.method) {
				this._actionsByMethod[actionInstance.method] = this._actionsByMethod[actionInstance.method] || [];
				this._actionsByMethod[actionInstance.method].push(actionInstance);
			}

			if (actionInstance.type) {
				this._actionsByType[actionInstance.type] = this._actionsByType[actionInstance.type] || [];
				this._actionsByType[actionInstance.type].push(actionInstance);
			}

			if (actionInstance.class) {
				actionInstance.class.forEach(cls => {
					this._actionsByClass[cls] = this._actionsByClass[cls] || [];
					this._actionsByClass[cls].push(actionInstance);
				});
			}
		});
	}

	this._linksByRel = {};
	this._linksByClass = {};
	this._linksByType = {};
	if (entity.links) {
		this.links = [];
		entity.links.forEach(link => {
			const linkInstance = new Link(link);
			this.links.push(linkInstance);

			linkInstance.rel.forEach(rel => {
				this._linksByRel[rel] = this._linksByRel[rel] || [];
				this._linksByRel[rel].push(linkInstance);
			});

			if (linkInstance.class) {
				linkInstance.class.forEach(cls => {
					this._linksByClass[cls] = this._linksByClass[cls] || [];
					this._linksByClass[cls].push(linkInstance);
				});
			}

			if (linkInstance.type) {
				this._linksByType[linkInstance.type] = this._linksByType[linkInstance.type] || [];
				this._linksByType[linkInstance.type].push(linkInstance);
			}
		});
	}

	this._entitiesByRel = {};
	this._entitiesByClass = {};
	this._entitiesByType = {};
	if (entity.entities) {
		this.entities = [];
		entity.entities.forEach(subEntity => {
			// Subentities must have a rel array
			assert(Array.isArray(subEntity.rel));

			let subEntityInstance;
			if ('string' === typeof subEntity.href) {
				subEntityInstance = new Link(subEntity);
			} else {
				subEntityInstance = new Entity(subEntity);
			}
			this.entities.push(subEntityInstance);

			subEntityInstance.rel.forEach(rel => {
				this._entitiesByRel[rel] = this._entitiesByRel[rel] || [];
				this._entitiesByRel[rel].push(subEntityInstance);
			});

			if (subEntityInstance.class) {
				subEntityInstance.class.forEach(cls => {
					this._entitiesByClass[cls] = this._entitiesByClass[cls] || [];
					this._entitiesByClass[cls].push(subEntityInstance);
				});
			}

			if (subEntityInstance.type) {
				this._entitiesByType[subEntityInstance.type] = this._entitiesByType[subEntityInstance.type] || [];
				this._entitiesByType[subEntityInstance.type].push(subEntityInstance);
			}
		});
	}
}

Entity.prototype.hasAction = function(actionName) {
	return this.hasActionByName(actionName);
};

Entity.prototype.hasActionByName = function(actionName) {
	return this._actionsByName.hasOwnProperty(actionName);
};

Entity.prototype.hasActionByClass = function(actionClass) {
	return this._actionsByClass.hasOwnProperty(actionClass);
};

Entity.prototype.hasActionByMethod = function(actionMethod) {
	return this._actionsByMethod.hasOwnProperty(actionMethod);
};

Entity.prototype.hasActionByType = function(actionType) {
	return this._actionsByType.hasOwnProperty(actionType);
};

Entity.prototype.hasClass = function(cls) {
	return this.class instanceof Array && this.class.indexOf(cls) > -1;
};

Entity.prototype.hasEntity = function(entityRel) {
	return this.hasEntityByRel(entityRel);
};

Entity.prototype.hasEntityByRel = function(entityRel) {
	return this._entitiesByRel.hasOwnProperty(entityRel);
};

Entity.prototype.hasEntityByClass = function(entityClass) {
	return this._entitiesByClass.hasOwnProperty(entityClass);
};

Entity.prototype.hasEntityByType = function(entityType) {
	return this._entitiesByType.hasOwnProperty(entityType);
};

Entity.prototype.hasLink = function(linkRel) {
	return this.hasLinkByRel(linkRel);
};

Entity.prototype.hasLinkByRel = function(linkRel) {
	return this._linksByRel.hasOwnProperty(linkRel);
};

Entity.prototype.hasLinkByClass = function(linkClass) {
	return this._linksByClass.hasOwnProperty(linkClass);
};

Entity.prototype.hasLinkByType = function(linkType) {
	return this._linksByType.hasOwnProperty(linkType);
};

Entity.prototype.hasProperty = function(property) {
	return this.hasOwnProperty('properties') && this.properties.hasOwnProperty(property);
};

Entity.prototype.getAction = function(actionName) {
	return this.getActionByName(actionName);
};

Entity.prototype.getActionByName = function(actionName) {
	return this._actionsByName[actionName];
};

Entity.prototype.getActionByClass = function(actionClass) {
	return this._getFirstOrUndefined('_actionsByClass', actionClass);
};

Entity.prototype.getActionsByClass = function(actionClass) {
	return this._getSetOrEmpty('_actionsByClass', actionClass);
};

Entity.prototype.getActionByMethod = function(actionMethod) {
	return this._getFirstOrUndefined('_actionsByMethod', actionMethod);
};

Entity.prototype.getActionsByMethod = function(actionMethod) {
	return this._getSetOrEmpty('_actionsByMethod', actionMethod);
};

Entity.prototype.getActionByType = function(actionType) {
	return this._getFirstOrUndefined('_actionsByType', actionType);
};

Entity.prototype.getActionsByType = function(actionType) {
	return this._getSetOrEmpty('_actionsByType', actionType);
};

Entity.prototype.getLink = function(linkRel) {
	return this.getLinkByRel(linkRel);
};

Entity.prototype.getLinks = function(linkRel) {
	return this.getLinksByRel(linkRel);
};

Entity.prototype.getLinkByRel = function(linkRel) {
	return this._getFirstOrUndefined('_linksByRel', linkRel);
};

Entity.prototype.getLinksByRel = function(linkRel) {
	return this._getSetOrEmpty('_linksByRel', linkRel);
};

Entity.prototype.getLinkByClass = function(linkClass) {
	return this._getFirstOrUndefined('_linksByClass', linkClass);
};

Entity.prototype.getLinksByClass = function(linkClass) {
	return this._getSetOrEmpty('_linksByClass', linkClass);
};

Entity.prototype.getLinkByType = function(linkType) {
	return this._getFirstOrUndefined('_linksByType', linkType);
};

Entity.prototype.getLinksByType = function(linkType) {
	return this._getSetOrEmpty('_linksByType', linkType);
};

Entity.prototype.getSubEntity = function(entityRel) {
	return this.getSubEntityByRel(entityRel);
};

Entity.prototype.getSubEntities = function(entityRel) {
	return this.getSubEntitiesByRel(entityRel);
};

Entity.prototype.getSubEntityByRel = function(entityRel) {
	return this._getFirstOrUndefined('_entitiesByRel', entityRel);
};

Entity.prototype.getSubEntitiesByRel = function(entityRel) {
	return this._getSetOrEmpty('_entitiesByRel', entityRel);
};

Entity.prototype.getSubEntityByClass = function(entityClass) {
	return this._getFirstOrUndefined('_entitiesByClass', entityClass);
};

Entity.prototype.getSubEntitiesByClass = function(entityClass) {
	return this._getSetOrEmpty('_entitiesByClass', entityClass);
};

Entity.prototype.getSubEntityByType = function(entityType) {
	return this._getFirstOrUndefined('_entitiesByType', entityType);
};

Entity.prototype.getSubEntitiesByType = function(entityType) {
	return this._getSetOrEmpty('_entitiesByType', entityType);
};

Entity.prototype._getFirstOrUndefined = function(set, key) {
	const vals = this[set][key];

	return vals ? vals[0] : undefined;
};

Entity.prototype._getSetOrEmpty = function(set, key) {
	const vals = this[set][key];

	return vals ? vals.slice() : [];
};

module.exports = Entity;
