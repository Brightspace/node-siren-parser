'use strict';

const
	Action = require('./Action'),
	Entity = require('./Entity'),
	Field = require('./Field'),
	Link = require('./Link');

module.exports = function(chai, utils) {
	const Assertion = chai.Assertion;

	// .all.
	Assertion.addProperty('all', /* @this */ function() {
		utils.flag(this, 'all', true);
	});

	// expect(resource).to.have.Xs(x1, x2, ...)
	function multipleArgMethod(name, key, validTypes) {
		Assertion.addChainableMethod(name, /* @this */ function() {
			const desiredValues = Array.prototype.slice.call(arguments);

			if (Array.isArray(this._obj)) {
				if (utils.flag(this, 'all')) {
					desiredValues.forEach(desiredValue => {
						this._obj.forEach(obj => {
							new Assertion(obj.constuctor in validTypes);
							this.assert(
								Array.isArray(obj[key]) && obj[key].indexOf(desiredValue) > -1,
								'expected #{this} to have Siren ' + key + ' #{exp}',
								'expected #{this} to not have Siren ' + key + ' #{exp}',
								desiredValue);
						});
					});
				} else {
					desiredValues.forEach(desiredValue => {
						const found = this._obj.some(obj => {
							new Assertion(obj.constuctor in validTypes);
							return Array.isArray(obj[key]) && obj[key].indexOf(desiredValue) > -1;
						});
						this.assert(
							found,
							'expected #{this} to have Siren ' + key + ' #{exp}',
							'expected #{this} to not have Siren ' + key + ' #{exp}',
							desiredValue);
					});
				}
			} else {
				new Assertion(this._obj.constuctor in validTypes);
				desiredValues.forEach(desiredValue => {
					this.assert(
						Array.isArray(this._obj[key]) && this._obj[key].indexOf(desiredValue) > -1,
						'expected #{this} to have Siren ' + key + ' #{exp}',
						'expected #{this} to not have Siren ' + key + ' #{exp}',
						desiredValue);
				});
			}
		});
	}
	multipleArgMethod('classes', 'class', [Action, Entity, Field, Link]);
	multipleArgMethod('rels', 'rel', [Entity, Link]);

	// expect(resource).to.have.X(x)
	function singleArgMethod(name, key, validTypes) {
		Assertion.addChainableMethod(name, /* @this */ function(desiredValue) {
			if (Array.isArray(this._obj)) {
				if (utils.flag(this, 'all')) {
					this._obj.forEach(obj => {
						new Assertion(obj.constuctor in validTypes);
						this.assert(
							obj[key] === desiredValue,
							'expected #{this} to have Siren ' + key + ' #{exp}',
							'expected #{this} to not have Siren ' + key + ' #{exp}',
							desiredValue);
					});
				} else {
					const found = this._obj.some(obj => {
						new Assertion(obj.constuctor in validTypes);
						return desiredValue === obj[key];
					});
					this.assert(
						found,
						'expected #{this} to have Siren ' + key + ' #{exp}',
						'expected #{this} to not have Siren ' + key + ' #{exp}',
						desiredValue);
				}
			} else {
				new Assertion(this._obj.constuctor in validTypes);
				this.assert(
					desiredValue === this._obj[key],
					'expected #{this} to have Siren ' + key + ' #{exp}',
					'expected #{this} to not have Siren ' + key + ' #{exp}',
					desiredValue);
			}
		});
	}
	singleArgMethod('href', 'href', [Action, Link]);
	singleArgMethod('name', 'name', [Action, Field]);
	singleArgMethod('method', 'method', [Action]);
	singleArgMethod('title', 'title', [Action, Entity, Field, Link]);
	singleArgMethod('type', 'type', [Action, Field, Link]);
	singleArgMethod('value', 'value', [Field]);

	// expect(resource).to.have.X, where X is an Array
	// changes the subject of the assertion to be X
	function arrayProperty(name, key, subjectType) {
		Assertion.addProperty(name, /* @this */ function() {
			new Assertion(this._obj).to.be.an.instanceof(subjectType);
			this.assert(
				Array.isArray(this._obj[key]),
				'expected #{this} to have Siren ' + key,
				'expected #{this} to not have Siren ' + key);
			utils.flag(this, 'object', this._obj[key]);
		});
	}
	arrayProperty('sirenAction', 'actions', Entity);
	arrayProperty('sirenActions', 'actions', Entity);
	arrayProperty('sirenEntity', 'entities', Entity);
	arrayProperty('sirenEntities', 'entities', Entity);
	arrayProperty('sirenField', 'fields', Action);
	arrayProperty('sirenFields', 'fields', Action);
	arrayProperty('sirenLink', 'links', Entity);
	arrayProperty('sirenLinks', 'links', Entity);

	// expect(resource).to.have.X, where X is an object
	// changes the subject of the assertion to be X
	function objectProperty(name, key, subjectType) {
		Assertion.addProperty(name, /* @this */ function() {
			new Assertion(this._obj).to.be.an.instanceof(subjectType);
			this.assert(
				'object' === typeof this._obj[key],
				'expected #{this} to have Siren ' + key,
				'expected #{this} to not have Siren ' + key);
			utils.flag(this, 'object', this._obj[key]);
		});
	}
	objectProperty('sirenProperty', 'properties', Entity);
	objectProperty('sirenProperties', 'properties', Entity);
};
