'use strict';

const
	Action = require('./Action'),
	Entity = require('./Entity'),
	Field = require('./Field'),
	Link = require('./Link');

module.exports = function (chai) {
	const Assertion = chai.Assertion;

	// expect(resource).to.be.a.siren('Type');
	Assertion.addChainableMethod('siren',
		function (type) {
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

	Assertion.addChainableMethod('sirenAction',
		// expect(entity).to.have.sirenAction('actionName')
		function (actionName) {
			new Assertion(this._obj).to.be.instanceof(Entity);
			const action = this._obj.getAction(actionName);

			this.assert(
				action instanceof Action,
				'expected #{this} to have Action #{exp}, but it does not',
				'expected #{this} to not have Action #{exp}',
				actionName);
		});

	Assertion.addChainableMethod('sirenClass',
		// expect(entity).to.have.sirenClass('className')
		function (cls) {
			new Assertion(this._obj).to.be.instanceof(Entity);

			this.assert(
				this._obj.hasClass(cls),
				'expected #{this} to have class #{exp}, but it does not',
				'expected #{this} to not have class #{exp}',
				cls);
		});

	Assertion.addChainableMethod('sirenClasses',
		// expect(entity).to.have.sirenClasses(['class1', 'class2', ...])
		function (classes) {
			new Assertion(this._obj).to.be.instanceof(Entity);
			new Assertion(classes).to.be.instanceof(Array);

			for (let i = 0; i < classes.length; i++) {
				this.assert(
					this._obj.hasClass(classes[i]),
					'expected #{exp} to be among classes of #{this}, but it was not',
					'expected #{exp} to not be among classes of #{this}',
					classes[i]);
			}
		});

	Assertion.addChainableMethod('sirenProperty',
		// expect(entity).to.have.sirenProperty('propertyKey')
		function (property) {
			new Assertion(this._obj).to.be.instanceof(Entity);

			this.assert(
				this._obj.hasProperty(property),
				'expected #{this} to have property #{exp}, but it does not',
				'expected #{this} to not have #{exp}',
				property);
		});

	Assertion.addChainableMethod('sirenProperties',
		// expect(entity).to.have.sirenProperties(['property1', 'property2', ...])
		function (properties) {
			new Assertion(this._obj).to.be.instanceof(Entity);
			new Assertion(properties).to.be.instanceof(Array);

			for (let i = 0; i < properties.length; i++) {
				this.assert(
					this._obj.hasProperty(properties[i]),
					'expected #{this} to have property #{exp}, but it does not',
					'expected #{this} to not have #{exp}',
					properties[i]);
			}
		});
};
