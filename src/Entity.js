import Action from './Action.js';
import assert from './assert.js';
import Link from './Link.js';
import { contains, getMatchingValue, getMatchingValuesByAll, hasProperty } from './util.js';

export default class Entity {
	constructor(entity) {
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

	toJSON() {
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
	}

	hasActionByName(actionName) {
		return hasProperty(this._actionsByName, actionName);
	}

	hasActionByClass(actionClass) {
		return hasProperty(this._actionsByClass, actionClass);
	}

	hasActionByMethod(actionMethod) {
		return hasProperty(this._actionsByMethod, actionMethod);
	}

	hasActionByType(actionType) {
		return hasProperty(this._actionsByType, actionType);
	}

	hasClass(cls) {
		return this.class instanceof Array && contains(this.class, cls);
	}

	hasSubEntityByRel(entityRel) {
		return hasProperty(this._entitiesByRel, entityRel);
	}

	hasSubEntityByClass(entityClass) {
		return hasProperty(this._entitiesByClass, entityClass);
	}

	hasSubEntityByType(entityType) {
		return hasProperty(this._entitiesByType, entityType);
	}

	hasLinkByRel(linkRel) {
		return hasProperty(this._linksByRel, linkRel);
	}

	hasLinkByClass(linkClass) {
		return hasProperty(this._linksByClass, linkClass);
	}

	hasLinkByType(linkType) {
		return hasProperty(this._linksByType, linkType);
	}

	hasProperty(property) {
		return hasProperty(this, 'properties') && hasProperty(this.properties, property);
	}

	getActionByName(actionName) {
		return getMatchingValue(this._actionsByName, actionName);
	}

	getActionByClass(actionClass) {
		const vals = getMatchingValue(this._actionsByClass, actionClass);
		return vals ? vals[0] : undefined;
	}

	getActionsByClass(actionClass) {
		const vals = getMatchingValue(this._actionsByClass, actionClass);
		return vals ? vals.slice() : [];
	}

	getActionByClasses(actionClasses) {
		const vals = getMatchingValuesByAll(this.actions, actionClasses, 'class');
		return vals && vals.length > 0 ? vals[0] : undefined;
	}

	getActionsByClasses(actionClasses) {
		const vals = getMatchingValuesByAll(this.actions, actionClasses, 'class');
		return vals && vals.length > 0 ? vals.slice() : [];
	}

	getActionByMethod(actionMethod) {
		const vals = getMatchingValue(this._actionsByMethod, actionMethod);
		return vals ? vals[0] : undefined;
	}

	getActionsByMethod(actionMethod) {
		const vals = getMatchingValue(this._actionsByMethod, actionMethod);
		return vals ? vals.slice() : [];
	}

	getActionByType(actionType) {
		const vals = getMatchingValue(this._actionsByType, actionType);
		return vals ? vals[0] : undefined;
	}

	getActionsByType(actionType) {
		const vals = getMatchingValue(this._actionsByType, actionType);
		return vals ? vals.slice() : [];
	}

	getLinkByRel(linkRel) {
		const vals = getMatchingValue(this._linksByRel, linkRel);
		return vals ? vals[0] : undefined;
	}

	getLinksByRel(linkRel) {
		const vals = getMatchingValue(this._linksByRel, linkRel);
		return vals ? vals.slice() : [];
	}

	getLinkByRels(linkRels) {
		const vals = getMatchingValuesByAll(this.links, linkRels, 'rel');
		return vals && vals.length > 0 ? vals[0] : undefined;
	}

	getLinksByRels(linkRels) {
		const vals = getMatchingValuesByAll(this.links, linkRels, 'rel');
		return vals && vals.length > 0 ? vals.slice() : [];
	}

	getLinkByClass(linkClass) {
		const vals = getMatchingValue(this._linksByClass, linkClass);
		return vals ? vals[0] : undefined;
	}

	getLinksByClass(linkClass) {
		const vals = getMatchingValue(this._linksByClass, linkClass);
		return vals ? vals.slice() : [];
	}

	getLinkByClasses(linkClasses) {
		const vals = getMatchingValuesByAll(this.links, linkClasses, 'class');
		return vals && vals.length > 0 ? vals[0] : undefined;
	}

	getLinksByClasses(linkClasses) {
		const vals = getMatchingValuesByAll(this.links, linkClasses, 'class');
		return vals && vals.length > 0 ? vals.slice() : [];
	}

	getLinkByType(linkType) {
		const vals = getMatchingValue(this._linksByType, linkType);
		return vals ? vals[0] : undefined;
	}

	getLinksByType(linkType) {
		const vals = getMatchingValue(this._linksByType, linkType);
		return vals ? vals.slice() : [];
	}

	getSubEntityByRel(entityRel) {
		const vals = getMatchingValue(this._entitiesByRel, entityRel);
		return vals ? vals[0] : undefined;
	}

	getSubEntitiesByRel(entityRel) {
		const vals = getMatchingValue(this._entitiesByRel, entityRel);
		return vals ? vals.slice() : [];
	}

	getSubEntityByRels(entityRels) {
		const vals = getMatchingValuesByAll(this.entities, entityRels, 'rel');
		return vals && vals.length > 0 ? vals[0] : undefined;
	}

	getSubEntitiesByRels(entityRels) {
		const vals = getMatchingValuesByAll(this.entities, entityRels, 'rel');
		return vals && vals.length > 0 ? vals.slice() : [];
	}

	getSubEntityByClass(entityClass) {
		const vals = getMatchingValue(this._entitiesByClass, entityClass);
		return vals ? vals[0] : undefined;
	}

	getSubEntitiesByClass(entityClass) {
		const vals = getMatchingValue(this._entitiesByClass, entityClass);
		return vals ? vals.slice() : [];
	}

	getSubEntityByClasses(entityClasses) {
		const vals = getMatchingValuesByAll(this.entities, entityClasses, 'class');
		return vals && vals.length > 0 ? vals[0] : undefined;
	}

	getSubEntitiesByClasses(entityClasses) {
		const vals = getMatchingValuesByAll(this.entities, entityClasses, 'class');
		return vals && vals.length > 0 ? vals.slice() : [];
	}

	getSubEntityByType(entityType) {
		const vals = getMatchingValue(this._entitiesByType, entityType);
		return vals ? vals[0] : undefined;
	}

	getSubEntitiesByType(entityType) {
		const vals = getMatchingValue(this._entitiesByType, entityType);
		return vals ? vals.slice() : [];
	}
}
