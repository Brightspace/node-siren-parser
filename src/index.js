import Action from './Action';
import assert from './assert';
import Link from './Link';
import { contains, getMatchingValue, getMatchingValuesByAll, hasProperty } from './util.js';

export default function Entity(entity) {
	entity = entity || {};

	if (entity instanceof Entity) {
		return entity;
	}
	if (!(this instanceof Entity)) {
		return new Entity(entity);
	}

	if ('object' !== typeof entity) {
		entity = JSON.parse(entity);
	}

	assert('undefined' === typeof entity.rel || Array.isArray(entity.rel),
		'entity.rel must be an array or undefined, got ' + JSON.stringify(entity.rel));
	assert('undefined' === typeof entity.title || 'string' === typeof entity.title,
		'entity.title must be a string or undefined, got ' + JSON.stringify(entity.title));
	assert('undefined' === typeof entity.type || 'string' === typeof entity.type,
		'entity.type must be a string or undefined, got ' + JSON.stringify(entity.type));
	assert('undefined' === typeof entity.properties || 'object' === typeof entity.properties,
		'entity.properties must be an object or undefined, got ' + JSON.stringify(entity.properties));
	assert('undefined' === typeof entity.class || Array.isArray(entity.class),
		'entity.class must be an array or undefined, got ' + JSON.stringify(entity.class));
	assert('undefined' === typeof entity.actions || Array.isArray(entity.actions),
		'entity.actions must be an array or undefined, got ' + JSON.stringify(entity.actions));
	assert('undefined' === typeof entity.links || Array.isArray(entity.links),
		'entity.links must be an array or undefined, got ' + JSON.stringify(entity.links));
	assert('undefined' === typeof entity.entities || Array.isArray(entity.entities),
		'entity.entities must be an array or undefined, got ' + JSON.stringify(entity.entities));

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
			assert(Array.isArray(subEntity.rel),
				'sub-entities must have a rel array, got ' + JSON.stringify(subEntity.rel));

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

Entity.prototype.toJSON = function() {
	return {
		rel: this.rel,
		title: this.title,
		type: this.type,
		properties: this.properties,
		class: this.class,
		actions: this.actions,
		links: this.links,
		entities: this.entities
	};
};

Entity.prototype.hasAction = function(actionName) {
	return this.hasActionByName(actionName);
};

Entity.prototype.hasActionByName = function(actionName) {
	return hasProperty(this._actionsByName, actionName);
};

Entity.prototype.hasActionByClass = function(actionClass) {
	return hasProperty(this._actionsByClass, actionClass);
};

Entity.prototype.hasActionByMethod = function(actionMethod) {
	return hasProperty(this._actionsByMethod, actionMethod);
};

Entity.prototype.hasActionByType = function(actionType) {
	return hasProperty(this._actionsByType, actionType);
};

Entity.prototype.hasClass = function(cls) {
	return this.class instanceof Array && contains(this.class, cls);
};

Entity.prototype.hasEntity = function(entityRel) {
	return this.hasSubEntityByRel(entityRel);
};

Entity.prototype.hasEntityByRel = function(entityRel) {
	return this.hasSubEntityByRel(entityRel);
};

Entity.prototype.hasSubEntityByRel = function(entityRel) {
	return hasProperty(this._entitiesByRel, entityRel);
};

Entity.prototype.hasEntityByClass = function(entityClass) {
	return this.hasSubEntityByClass(entityClass);
};

Entity.prototype.hasSubEntityByClass = function(entityClass) {
	return hasProperty(this._entitiesByClass, entityClass);
};

Entity.prototype.hasEntityByType = function(entityType) {
	return this.hasSubEntityByType(entityType);
};

Entity.prototype.hasSubEntityByType = function(entityType) {
	return hasProperty(this._entitiesByType, entityType);
};

Entity.prototype.hasLink = function(linkRel) {
	return this.hasLinkByRel(linkRel);
};

Entity.prototype.hasLinkByRel = function(linkRel) {
	return hasProperty(this._linksByRel, linkRel);
};

Entity.prototype.hasLinkByClass = function(linkClass) {
	return hasProperty(this._linksByClass, linkClass);
};

Entity.prototype.hasLinkByType = function(linkType) {
	return hasProperty(this._linksByType, linkType);
};

Entity.prototype.hasProperty = function(property) {
	return hasProperty(this, 'properties') && hasProperty(this.properties, property);
};

Entity.prototype.getAction = function(actionName) {
	return this.getActionByName(actionName);
};

Entity.prototype.getActionByName = function(actionName) {
	return getMatchingValue(this._actionsByName, actionName);
};

Entity.prototype.getActionByClass = function(actionClass) {
	const vals = getMatchingValue(this._actionsByClass, actionClass);
	return vals ? vals[0] : undefined;
};

Entity.prototype.getActionsByClass = function(actionClass) {
	const vals = getMatchingValue(this._actionsByClass, actionClass);
	return vals ? vals.slice() : [];
};

Entity.prototype.getActionByClasses = function(actionClasses) {
	const vals = getMatchingValuesByAll(this.actions, actionClasses, 'class');
	return vals && vals.length > 0 ? vals[0] : undefined;
};

Entity.prototype.getActionsByClasses = function(actionClasses) {
	const vals = getMatchingValuesByAll(this.actions, actionClasses, 'class');
	return vals && vals.length > 0 ? vals.slice() : [];
};

Entity.prototype.getActionByMethod = function(actionMethod) {
	const vals = getMatchingValue(this._actionsByMethod, actionMethod);
	return vals ? vals[0] : undefined;
};

Entity.prototype.getActionsByMethod = function(actionMethod) {
	const vals = getMatchingValue(this._actionsByMethod, actionMethod);
	return vals ? vals.slice() : [];
};

Entity.prototype.getActionByType = function(actionType) {
	const vals = getMatchingValue(this._actionsByType, actionType);
	return vals ? vals[0] : undefined;
};

Entity.prototype.getActionsByType = function(actionType) {
	const vals = getMatchingValue(this._actionsByType, actionType);
	return vals ? vals.slice() : [];
};

Entity.prototype.getLink = function(linkRel) {
	return this.getLinkByRel(linkRel);
};

Entity.prototype.getLinks = function(linkRel) {
	return this.getLinksByRel(linkRel);
};

Entity.prototype.getLinkByRel = function(linkRel) {
	const vals = getMatchingValue(this._linksByRel, linkRel);
	return vals ? vals[0] : undefined;
};

Entity.prototype.getLinksByRel = function(linkRel) {
	const vals = getMatchingValue(this._linksByRel, linkRel);
	return vals ? vals.slice() : [];
};

Entity.prototype.getLinkByRels = function(linkRels) {
	const vals = getMatchingValuesByAll(this.links, linkRels, 'rel');
	return vals && vals.length > 0 ? vals[0] : undefined;
};

Entity.prototype.getLinksByRels = function(linkRels) {
	const vals = getMatchingValuesByAll(this.links, linkRels, 'rel');
	return vals && vals.length > 0 ? vals.slice() : [];
};

Entity.prototype.getLinkByClass = function(linkClass) {
	const vals = getMatchingValue(this._linksByClass, linkClass);
	return vals ? vals[0] : undefined;
};

Entity.prototype.getLinksByClass = function(linkClass) {
	const vals = getMatchingValue(this._linksByClass, linkClass);
	return vals ? vals.slice() : [];
};

Entity.prototype.getLinkByClasses = function(linkClasses) {
	const vals = getMatchingValuesByAll(this.links, linkClasses, 'class');
	return vals && vals.length > 0 ? vals[0] : undefined;
};

Entity.prototype.getLinksByClasses = function(linkClasses) {
	const vals = getMatchingValuesByAll(this.links, linkClasses, 'class');
	return vals && vals.length > 0 ? vals.slice() : [];
};

Entity.prototype.getLinkByType = function(linkType) {
	const vals = getMatchingValue(this._linksByType, linkType);
	return vals ? vals[0] : undefined;
};

Entity.prototype.getLinksByType = function(linkType) {
	const vals = getMatchingValue(this._linksByType, linkType);
	return vals ? vals.slice() : [];
};

Entity.prototype.getSubEntity = function(entityRel) {
	return this.getSubEntityByRel(entityRel);
};

Entity.prototype.getSubEntities = function(entityRel) {
	return this.getSubEntitiesByRel(entityRel);
};

Entity.prototype.getSubEntityByRel = function(entityRel) {
	const vals = getMatchingValue(this._entitiesByRel, entityRel);
	return vals ? vals[0] : undefined;
};

Entity.prototype.getSubEntitiesByRel = function(entityRel) {
	const vals = getMatchingValue(this._entitiesByRel, entityRel);
	return vals ? vals.slice() : [];
};

Entity.prototype.getSubEntityByRels = function(entityRels) {
	const vals = getMatchingValuesByAll(this.entities, entityRels, 'rel');
	return vals && vals.length > 0 ? vals[0] : undefined;
};

Entity.prototype.getSubEntitiesByRels = function(entityRels) {
	const vals = getMatchingValuesByAll(this.entities, entityRels, 'rel');
	return vals && vals.length > 0 ? vals.slice() : [];
};

Entity.prototype.getSubEntityByClass = function(entityClass) {
	const vals = getMatchingValue(this._entitiesByClass, entityClass);
	return vals ? vals[0] : undefined;
};

Entity.prototype.getSubEntitiesByClass = function(entityClass) {
	const vals = getMatchingValue(this._entitiesByClass, entityClass);
	return vals ? vals.slice() : [];
};

Entity.prototype.getSubEntityByClasses = function(entityClasses) {
	const vals = getMatchingValuesByAll(this.entities, entityClasses, 'class');
	return vals && vals.length > 0 ? vals[0] : undefined;
};

Entity.prototype.getSubEntitiesByClasses = function(entityClasses) {
	const vals = getMatchingValuesByAll(this.entities, entityClasses, 'class');
	return vals && vals.length > 0 ? vals.slice() : [];
};

Entity.prototype.getSubEntityByType = function(entityType) {
	const vals = getMatchingValue(this._entitiesByType, entityType);
	return vals ? vals[0] : undefined;
};

Entity.prototype.getSubEntitiesByType = function(entityType) {
	const vals = getMatchingValue(this._entitiesByType, entityType);
	return vals ? vals.slice() : [];
};

export {
	Entity,
	Action,
	Link
};
