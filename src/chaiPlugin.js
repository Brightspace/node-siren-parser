'use strict';

const
	Action = require('./Action'),
	Entity = require('./Entity'),
	Field = require('./Field'),
	Link = require('./Link');

module.exports = function(chai, utils) {
	const Assertion = chai.Assertion;

	// expect(resource).to.be.a.siren('Type');
	Assertion.addChainableMethod('siren',
		/* @this */ function(type) {
			new Assertion(type).to.be.a('string');
			type = type.toLowerCase();

			switch (type) {
				case 'action': {
					this.assert(
						this._obj instanceof Action,
						'expected #{this} to be an Action',
						'expected #{this} to not be an Action');
					break;
				}
				case 'class': {
					new Assertion(this._obj).to.be.an.instanceof(Array);
					for (let i = 0; i < this._obj.length; i++) {
						this.assert(
							'string' === typeof this._obj[i],
							'expected #{this} to be an array of classes',
							'expected #{this} to not be an array of classes');
					}
					break;
				}
				case 'entity': {
					this.assert(
						this._obj instanceof Entity,
						'expected #{this} to be an Entity',
						'expected #{this} to not be an Entity');
					break;
				}
				case 'field': {
					this.assert(
						this._obj instanceof Field,
						'expected #{this} to be an Field',
						'expected #{this} to not be an Field');
					break;
				}
				case 'link': {
					this.assert(
						this._obj instanceof Link,
						'expected #{this} to be an Link',
						'expected #{this} to not be an Link');
					break;
				}
			}
		});

	// expect(resource).to.have.sirenClass('className')
	Assertion.addChainableMethod('sirenClass',
		/* @this */ function(cls) {
			this.assert(
				this._obj.hasClass(cls),
				'expected #{this} to have class #{exp}, but it does not',
				'expected #{this} to not have class #{exp}',
				cls);
		});
	// expect(resource).to.have.sirenClasses(['class1', 'class2', ...])
	Assertion.addChainableMethod('sirenClasses',
		/* @this */ function(classes) {
			new Assertion(classes).to.be.an.instanceof(Array);

			for (let i = 0; i < classes.length; i++) {
				this.assert(
					this._obj.hasClass(classes[i]),
					'expected #{exp} to be among classes of #{this}, but it was not',
					'expected #{exp} to not be among classes of #{this}',
					classes[i]);
			}
		});

	// expect(entity).to.have.sirenAction('actionName')
	// expect(entity).to.have.sirenActionByName('actionName')
	const actionByName = /* @this */ function(actionName) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);
		const action = this._obj.getActionByName(actionName);

		this.assert(
			action instanceof Action,
			'expected #{this} to have Action #{exp}',
			'expected #{this} to not have Action #{exp}',
			actionName);
		utils.flag(this, 'object', this._obj.getActionByName(actionName));
	};
	Assertion.addChainableMethod('sirenAction', actionByName);
	Assertion.addChainableMethod('sirenActionByName', actionByName);
	// expect(entity).to.have.sirenActions(['actionName1', 'actionName2', ...])
	// expect(entity).to.have.sirenActionsByName(['actionName1', 'actionName2', ...])
	const actionsByName = /* @this */ function(actionNames) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);
		new Assertion(actionNames).to.be.an.instanceof(Array);

		for (var i = 0; i < actionNames.length; i++) {
			this.assert(
				this._obj.hasActionByName(actionNames[i]),
				'expected #{exp} to be among actions of #{this}',
				'expected #{exp} to not be among actions of #{this}',
				actionNames[i]);
		}
	};
	Assertion.addChainableMethod('sirenActions', actionsByName);
	Assertion.addChainableMethod('sirenActionsByName', actionsByName);

	// expect(entity).to.have.sirenActionByClass('actionClass')
	const actionByClass = /* @this */ function(actionClass) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);
		const action = this._obj.getActionByClass(actionClass);

		this.assert(
			action instanceof Action,
			'expected #{this} to have Action with class #{exp}',
			'expected #{this} to not have Action with class #{exp}',
			actionClass);
		utils.flag(this, 'object', this._obj.getActionByClass(actionClass));
	};
	Assertion.addChainableMethod('sirenActionByClass', actionByClass);
	// expect(entity).to.have.sirenActionsByClass(['actionClass1', 'actionClass2', ...])
	const actionsByClass = /* @this */ function(actionClasses) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);
		new Assertion(actionClasses).to.be.an.instanceof(Array);

		for (var i = 0; i < actionClasses.length; i++) {
			this.assert(
				this._obj.hasActionByClass(actionClasses[i]),
				'expected #{exp} to be among actions of #{this}',
				'expected #{exp} to not be among actions of #{this}',
				actionClasses[i]);
		}
	};
	Assertion.addChainableMethod('sirenActionsByClass', actionsByClass);

	// expect(entity).to.have.sirenEntity('rel')
	// expect(entity).to.have.sirenEntityByRel('rel')
	const entityByRel = /* @this */ function(entityRel) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);

		this.assert(
			this._obj.hasEntityByRel(entityRel),
			'expected #{this} to have sub-entity #{exp}',
			'expected #{this} to not have sub-entity #{exp}',
			entityRel);
		utils.flag(this, 'object', this._obj.getSubEntityByRel(entityRel));
	};
	Assertion.addChainableMethod('sirenEntity', entityByRel);
	Assertion.addChainableMethod('sirenEntityByRel', entityByRel);

	// expect(entity).to.have.sirenEntities(['rel1', 'rel2', ...])
	// expect(entity).to.have.sirenEntitiesByRel(['rel1', 'rel2', ...])
	const entitiesByRel = /* @this */ function(entityRels) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);
		new Assertion(entityRels).to.be.an.instanceof(Array);

		for (let i = 0; i < entityRels.length; i++) {
			this.assert(
				this._obj.hasEntity(entityRels[i]),
				'expected #{this} to have a sub-entity with rel #{exp}',
				'expected #{this} to not have a sub-entity with rel #{exp}',
				entityRels[i]);
		}
	};
	Assertion.addChainableMethod('sirenEntities', entitiesByRel);
	Assertion.addChainableMethod('sirenEntitiesByRel', entitiesByRel);

	// expect(entity).to.have.sirenEntityByClass('class');
	const entityByClass = /* @this */ function(entityClass) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);

		this.assert(
			this._obj.hasEntityByClass(entityClass),
			'expected #{this} to have a sub-entity with class #{exp}',
			'expected #{this} to not have a sub-entity with class #{exp}',
			entityClass);
		utils.flag(this, 'object', this._obj.getSubEntityByClass(entityClass));
	};
	Assertion.addChainableMethod('sirenEntityByClass', entityByClass);
	// expect(entity).to.have.sirenEntitiesByClass(['class1', 'class2', ...])
	const entitiesByClass = /* @this */ function(entityClasses) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);
		new Assertion(entityClasses).to.be.an.instanceof(Array);

		for (let i = 0; i < entityClasses.length; i++) {
			this.assert(
				this._obj.hasEntityByClass(entityClasses[i]),
				'expected #{this} to have a sub-entity with class #{exp}',
				'expected #{this} to not have a sub-entity with class #{exp}',
				entityClasses[i]);
		}
	};
	Assertion.addChainableMethod('sirenEntitiesByClass', entitiesByClass);

	// expect(entity).to.have.sirenEntityByType('type');
	const entityByType = /* @this */ function(entityType) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);

		this.assert(
			this._obj.hasEntityByType(entityType),
			'expected #{this} to have a sub-entity with type #{exp}',
			'expected #{this} to not have a sub-entity with type #{exp}',
			entityType);
		utils.flag(this, 'object', this._obj.getSubEntityByType(entityType));
	};
	Assertion.addChainableMethod('sirenEntityByType', entityByType);
	// expect(entity).to.have.sirenEntitiesByType(['type1', 'type2', ...])
	const entitiesByType = /* @this */ function(entityTypes) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);
		new Assertion(entityTypes).to.be.an.instanceof(Array);

		for (let i = 0; i < entityTypes.length; i++) {
			this.assert(
				this._obj.hasEntityByType(entityTypes[i]),
				'expected #{this} to have a sub-entity with type #{exp}',
				'expected #{this} to not have a sub-entity with type #{exp}',
				entityTypes[i]);
		}
	};
	Assertion.addChainableMethod('sirenEntitiesByType', entitiesByType);

	// expect(entity).to.have.sirenLink('rel')
	// expect(entity).to.have.sirenLinkByRel('rel')
	const linkByRel = /* @this */ function(linkRel) {
		new Assertion(this._obj).to.be.an.instanceOf(Entity);

		this.assert(
			this._obj.hasLinkByRel(linkRel),
			'expected #{this} to have a Link with rel #{exp}',
			'expected #{this} to not have a link with rel #{exp}',
			linkRel);
		utils.flag(this, 'object', this._obj.getLinkByRel(linkRel));
	};
	Assertion.addChainableMethod('sirenLink', linkByRel);
	Assertion.addChainableMethod('sirenLinkByRel', linkByRel);
	// expect(entity).to.have.sirenLinks(['rel1', 'rel2', ...])
	// expect(entity).to.have.sirenLinksByRel(['rel1', 'rel2', ...])
	const linksByRel = /* @this */ function(linkRels) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);
		new Assertion(linkRels).to.be.an.instanceof(Array);

		for (var i = 0; i < linkRels.length; i++) {
			this.assert(
				this._obj.hasLinkByRel(linkRels[i]),
				'expected #{exp} to have a link with rel #{this}',
				'expected #{exp} to not have a link with rel #{this}',
				linkRels[i]);
		}
	};
	Assertion.addChainableMethod('sirenLinks', linksByRel);
	Assertion.addChainableMethod('sirenLinksByRel', linksByRel);

	// expect(entity).to.have.sirenLinkByClass('class');
	const linkByClass = /* @this */ function(linkClass) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);

		this.assert(
			this._obj.hasLinkByClass(linkClass),
			'expected #{this} to have a link with class #{exp}',
			'expected #{this} to not have a link with class #{exp}',
			linkClass);
		utils.flag(this, 'object', this._obj.getLinkByClass(linkClass));
	};
	Assertion.addChainableMethod('sirenLinkByClass', linkByClass);
	// expect(entity).to.have.sirenLinksByClass(['class1', 'class2', ...])
	const linksByClass = /* @this */ function(linkClasses) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);
		new Assertion(linkClasses).to.be.an.instanceof(Array);

		for (let i = 0; i < linkClasses.length; i++) {
			this.assert(
				this._obj.hasLinkByClass(linkClasses[i]),
				'expected #{this} to have a link with class #{exp}',
				'expected #{this} to not have a link with class #{exp}',
				linkClasses[i]);
		}
	};
	Assertion.addChainableMethod('sirenLinksByClass', linksByClass);

	// expect(entity).to.have.sirenLinkByType('type');
	const linkByType = /* @this */ function(linkType) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);

		this.assert(
			this._obj.hasLinkByType(linkType),
			'expected #{this} to have a link with type #{exp}',
			'expected #{this} to not have a link with type #{exp}',
			linkType);
		utils.flag(this, 'object', this._obj.getLinkByType(linkType));
	};
	Assertion.addChainableMethod('sirenLinkByType', linkByType);
	// expect(entity).to.have.sirenLinkByType(['type1', 'type2', ...])
	const linksByType = /* @this */ function(linkTypes) {
		new Assertion(this._obj).to.be.an.instanceof(Entity);
		new Assertion(linkTypes).to.be.an.instanceof(Array);

		for (let i = 0; i < linkTypes.length; i++) {
			this.assert(
				this._obj.hasLinkByType(linkTypes[i]),
				'expected #{this} to have a link with type #{exp}',
				'expected #{this} to not have a link with type #{exp}',
				linkTypes[i]);
		}
	};
	Assertion.addChainableMethod('sirenLinksByType', linksByType);

	// expect(entity).to.have.sirenProperty('propertyKey')
	Assertion.addChainableMethod('sirenProperty',
		/* @this */ function(property) {
			new Assertion(this._obj).to.be.an.instanceof(Entity);

			this.assert(
				this._obj.hasProperty(property),
				'expected #{this} to have property #{exp}',
				'expected #{this} to not have #{exp}',
				property);
			utils.flag(this, 'object', this._obj.properties[property]);
		});
	// expect(entity).to.have.sirenProperties(['property1', 'property2', ...])
	Assertion.addChainableMethod('sirenProperties',
		/* @this */ function(properties) {
			new Assertion(this._obj).to.be.an.instanceof(Entity);
			new Assertion(properties).to.be.an.instanceof(Array);

			for (let i = 0; i < properties.length; i++) {
				this.assert(
					this._obj.hasProperty(properties[i]),
					'expected #{this} to have property #{exp}',
					'expected #{this} to not have #{exp}',
					properties[i]);
			}
		});

	// expect(action).to.have.sirenField('name')
	// expect(action).to.have.sirenFieldByName('name')
	const fieldByName = /* @this */ function(name) {
		new Assertion(this._obj).to.be.an.instanceof(Action);

		this.assert(
			this._obj.hasFieldByName(name),
			'expected #{this} to have field with name #{exp}',
			'expected #{this} to not have field with name #{exp}',
			name);
		utils.flag(this, 'object', this._obj.getFieldByName(name));
	};
	Assertion.addChainableMethod('sirenField', fieldByName);
	Assertion.addChainableMethod('sirenFieldByName', fieldByName);
	// expect(action).to.have.sirenFields(['name1', 'name2', ...])
	// expect(action).to.have.sirenFieldsByName(['name1', 'name2', ...])
	const fieldsByName = /* @this */ function(fieldNames) {
		new Assertion(this._obj).to.be.an.instanceof(Action);

		for (let i = 0; i < fieldNames.length; i++) {
			this.assert(
				this._obj.hasFieldByName(fieldNames[i]),
				'expected #{this} to have field with name #{exp}',
				'expected #{this} to not have field with name #{exp}',
				fieldNames[i]);
		}
	};
	Assertion.addChainableMethod('sirenFields', fieldsByName);
	Assertion.addChainableMethod('sirenFieldsByName', fieldsByName);

	// expect(action).to.have.sirenFieldByClass('class')
	const fieldByClass = /* @this */ function(cls) {
		new Assertion(this._obj).to.be.an.instanceof(Action);

		this.assert(
			this._obj.hasFieldByClass(cls),
			'expected #{this} to have field with class #{exp}',
			'expected #{this} to not have field with class #{exp}',
			cls);
		utils.flag(this, 'object', this._obj.getFieldByClass(cls));
	};
	Assertion.addChainableMethod('sirenFieldByClass', fieldByClass);
	// expect(action).to.have.sirenFieldsByClass(['class1', 'class2', ...])
	const fieldsByClass = /* @this */ function(fieldClasses) {
		new Assertion(this._obj).to.be.an.instanceof(Action);

		for (let i = 0; i < fieldClasses.length; i++) {
			this.assert(
				this._obj.hasFieldByClass(fieldClasses[i]),
				'expected #{this} to have field with class #{exp}',
				'expected #{this} to not have field with class #{exp}',
				fieldClasses[i]);
		}
	};
	Assertion.addChainableMethod('sirenFieldsByClass', fieldsByClass);

	// expect(action).to.have.sirenFieldByType('type')
	const fieldByType = /* @this */ function(type) {
		new Assertion(this._obj).to.be.an.instanceof(Action);

		this.assert(
			this._obj.hasFieldByType(type),
			'expected #{this} to have field with type #{exp}',
			'expected #{this} to not have field with type #{exp}',
			type);
		utils.flag(this, 'object', this._obj.getFieldByType(type));
	};
	Assertion.addChainableMethod('sirenFieldByType', fieldByType);
	// expect(action).to.have.sirenFieldsByType(['type1', 'type2', ...])
	const fieldsByType = /* @this */ function(fieldTypes) {
		new Assertion(this._obj).to.be.an.instanceof(Action);

		for (let i = 0; i < fieldTypes.length; i++) {
			this.assert(
				this._obj.hasFieldByType(fieldTypes[i]),
				'expected #{this} to have field with type #{exp}',
				'expected #{this} to not have field with type #{exp}',
				fieldTypes[i]);
		}
	};
	Assertion.addChainableMethod('sirenFieldsByType', fieldsByType);
};
