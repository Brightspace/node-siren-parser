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

	// expect(entity).to.have.sirenAction('actionName')
	Assertion.addChainableMethod('sirenAction',
		/* @this */ function(actionName) {
			new Assertion(this._obj).to.be.an.instanceof(Entity);
			const action = this._obj.getAction(actionName);

			this.assert(
				action instanceof Action,
				'expected #{this} to have Action #{exp}, but it does not',
				'expected #{this} to not have Action #{exp}',
				actionName);
			utils.flag(this, 'object', this._obj.getAction(actionName));
		});

	// expect(entity).to.have.sirenActions(['actionName1', 'actionName2', ...])
	Assertion.addChainableMethod('sirenActions',
		/* @this */ function(actionNames) {
			new Assertion(this._obj).to.be.an.instanceof(Entity);
			new Assertion(actionNames).to.be.an.instanceof(Array);

			for (var i = 0; i < actionNames.length; i++) {
				this.assert(
					this._obj.hasAction(actionNames[i]),
					'expected #{exp} to be among actions of #{this}, but it was not',
					'expected #{exp} to not be among actions of #{this}',
					actionNames[i]);
			}
		});

	// expect(entity).to.have.sirenClass('className')
	Assertion.addChainableMethod('sirenClass',
		/* @this */ function(cls) {
			this.assert(
				this._obj.hasClass(cls),
				'expected #{this} to have class #{exp}, but it does not',
				'expected #{this} to not have class #{exp}',
				cls);
		});

	// expect(entity).to.have.sirenClasses(['class1', 'class2', ...])
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

	// expect(entity).to.have.sirenEntity('relName')
	Assertion.addChainableMethod('sirenEntity',
		/* @this */ function(entityRel) {
			new Assertion(this._obj).to.be.an.instanceof(Entity);

			this.assert(
				this._obj.hasEntity(entityRel),
				'expected #{this} to have sub-entity #{exp}',
				'expected #{this} to not have sub-entity #{exp}',
				entityRel);
			utils.flag(this, 'object', this._obj.getSubEntity(entityRel));
		});

	// expect(entity).to.have.sirenEntities(['relName1', 'relName2', ...])
	Assertion.addChainableMethod('sirenEntities',
		/* @this */ function(entityRels) {
			new Assertion(this._obj).to.be.an.instanceof(Entity);
			new Assertion(entityRels).to.be.an.instanceof(Array);

			for (let i = 0; i < entityRels.length; i++) {
				this.assert(
					this._obj.hasEntity(entityRels[i]),
					'expected #{this} to have sub-entity #{exp}',
					'expected #{this} to not have sub-entity #{exp}',
					entityRels[i]);
			}
		});

	// expect(action).to.have.sirenField('name')
	Assertion.addChainableMethod('sirenField',
		/* @this */ function(name) {
			new Assertion(this._obj).to.be.an.instanceof(Action);

			this.assert(
				this._obj.hasField(name),
				'expected #{this} to have field #{exp}',
				'expected #{this} to not have field #{exp}',
				name);
			utils.flag(this, 'object', this._obj.getField(name));
		});

	// expect(action).to.have.sirenFields(['name1', 'name2', ...])
	Assertion.addChainableMethod('sirenFields',
		/* @this */ function(fieldNames) {
			new Assertion(this._obj).to.be.an.instanceof(Action);

			for (let i = 0; i < fieldNames.length; i++) {
				this.assert(
					this._obj.hasField(fieldNames[i]),
					'expected #{this} to have field #{exp}',
					'expected #{this} to not have field #{exp}',
					fieldNames[i]);
			}
		});

	// expect(entity).to.have.sirenLink('relName')
	Assertion.addChainableMethod('sirenLink',
		/* @this */ function(rel) {
			new Assertion(this._obj).to.be.an.instanceOf(Entity);

			this.assert(
				this._obj.hasLink(rel),
				'expected #{this} to have a Link with rel #{exp}',
				'expected #{this} to not have a link with rel #{exp}',
				rel);
			utils.flag(this, 'object', this._obj.getLink(rel));
		});

	// expect(entity).to.have.sirenLinks(['relName1', 'relName2', ...])
	Assertion.addChainableMethod('sirenLinks',
		/* @this */ function(rels) {
			new Assertion(this._obj).to.be.an.instanceof(Entity);
			new Assertion(rels).to.be.an.instanceof(Array);

			for (var i = 0; i < rels.length; i++) {
				this.assert(
					this._obj.hasLink(rels[i]),
					'expected #{exp} to be among links of #{this}, but it was not',
					'expected #{exp} to not be among links of #{this}',
					rels[i]);
			}
		});

	// expect(entity).to.have.sirenProperty('propertyKey')
	Assertion.addChainableMethod('sirenProperty',
		/* @this */ function(property) {
			new Assertion(this._obj).to.be.an.instanceof(Entity);

			this.assert(
				this._obj.hasProperty(property),
				'expected #{this} to have property #{exp}, but it does not',
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
					'expected #{this} to have property #{exp}, but it does not',
					'expected #{this} to not have #{exp}',
					properties[i]);
			}
		});
};
