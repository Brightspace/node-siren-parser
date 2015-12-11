/* global describe, it, beforeEach, afterEach */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon');

const
	Action = require('../src/Action'),
	Entity = require('../'),
	Link = require('../src/Link');

chai.use(require('sinon-chai'));

describe('Entity', function() {
	let
		resource,
		sandbox,
		siren;

	beforeEach(function() {
		resource = {};
		siren = undefined;
		sandbox = sinon.sandbox.create();
		sandbox.stub(console, 'error');
		sandbox.stub(console, 'warn');
	});

	afterEach(function() {
		sandbox.restore();
	});

	function buildEntity() {
		return new Entity(resource);
	}

	it('should auto-instantiate', function() {
		expect(Entity(resource)).to.be.an.instanceof(Entity);
	});

	it('should work with stringified entity', function() {
		resource = '{}';
		expect(buildEntity()).to.be.an('object');
	});

	describe('title', function() {
		it('should parse title', function() {
			resource.title = 'A title!';
			siren = buildEntity();
			expect(siren.title).to.equal('A title!');
		});

		it('should require title be a string, if supplied', function() {
			resource.title = 1;
			expect(buildEntity.bind()).to.throw();
		});
	});

	describe('type', function() {
		it('should parse type', function() {
			resource.type = 'foo';
			siren = buildEntity();
			expect(siren.type).to.equal('foo');
		});

		it('should require type be a string, if supplied', function() {
			resource.type = 1;
			expect(buildEntity.bind()).to.throw();
		});
	});

	describe('properties', function() {
		it('should parse properties', function() {
			resource.properties = {};
			siren = buildEntity();
			expect(siren.properties).to.be.an('object');
		});

		it('should require properties be an object, if supplied', function() {
			resource.properties = 1;
			expect(buildEntity.bind()).to.throw();
		});

		it('should be able to determine if an entity has a given property', function() {
			resource.properties = {
				foo: 'bar'
			};
			siren = buildEntity();
			expect(siren.hasProperty('foo')).to.be.true;
		});
	});

	describe('class', function() {
		it('should parse class', function() {
			resource.class = [];
			siren = buildEntity();
			expect(siren.class).to.be.an.instanceof(Array);
		});

		it('should require class be an array, if supplied', function() {
			resource.class = 1;
			expect(buildEntity.bind()).to.throw();
		});

		it('should be able to determine if an entity has a given class', function() {
			resource.class = ['foo'];
			siren = buildEntity();
			expect(siren.hasClass('foo')).to.be.true;

			resource.class = undefined;
			siren = buildEntity();
			expect(siren.hasClass('foo')).to.be.false;
		});
	});

	describe('actions', function() {
		it('should parse actions', function() {
			resource.actions = [],
			siren = buildEntity();
			expect(siren.actions).to.be.an.instanceof(Array);
		});

		it('should require actions be an array, if supplied', function() {
			resource.actions = 1;
			expect(buildEntity.bind()).to.throw();
		});

		it('should be able to retrieve actions based off their name', function() {
			resource.actions = [{
				name: 'foo',
				href: 'bar'
			}];
			siren = buildEntity();
			expect(siren.getAction('foo')).to.have.property('href', 'bar');
		});
	});

	describe('links', function() {
		it('should parse links', function() {
			resource.links = [],
			siren = buildEntity();
			expect(siren.links).to.be.an.instanceof(Array);
		});

		it('should require links be an array, if supplied', function() {
			resource.links = 1;
			expect(buildEntity.bind()).to.throw();
		});

		it('should be able to determine if an entity has a given link', function() {
			resource.links = [{
				rel: ['foo'],
				href: 'bar'
			}];
			siren = buildEntity();
			expect(siren.hasLink('foo')).to.be.true;
		});

		describe('getLink/getLinks', function() {
			beforeEach('', function() {
				resource.links = [{
					rel: ['foo'],
					href: 'bar'
				}, {
					rel: ['foo', 'foo2'],
					href: 'bar2'
				}];
				siren = buildEntity();
			});

			it('should be able to retrieve the first link with a given rel', function() {
				expect(siren.getLink('foo')).to.have.property('href', 'bar');
			});

			it('should be able to retrieve all links with a given rel', function() {
				expect(siren.getLinks('foo')).to.be.an.instanceof(Array).with.lengthOf(2);
			});

			it('should return a new array when retrieving all links', function() {
				expect(siren.getLinks('foo')).to.not.equal(siren.getLinks('foo'));
			});

			describe('when there is no link of the given rel', function() {
				it('should return undefined when retrieving the first link', function() {
					expect(siren.getLink('baz')).to.not.be.defined;
				});

				it('should return ann empty array when retrieving all links', function() {
					expect(siren.getLinks('baz'))
						.to.be.an.instanceof(Array)
						.and.to.be.empty;
				});
			});
		});
	});

	describe('(sub)entities', function() {
		it('should parse (sub)entities', function() {
			resource.entities = [];
			siren = buildEntity();
			expect(siren.entities).to.be.an.instanceof(Array);
		});

		it('should require (sub)entities be an array, if supplied', function() {
			resource.entities = 1;
			expect(buildEntity.bind()).to.throw();
		});

		it('should require (sub)entities have a rel', function() {
			resource.entities = [{
				foo: 'bar'
			}];
			expect(buildEntity.bind()).to.throw();
		});

		it('should work with chained Entity/Action/Links', function() {
			resource.entities = [{
				rel: ['foo'],
				actions: [{
					name: 'bar',
					href: 'baz'
				}]
			}];
			siren = buildEntity();
			expect(siren.getSubEntity('foo').getAction('bar'))
				.to.be.an.instanceof(Action)
				.with.property('href', 'baz');
		});

		it('should correctly identify entity sub-entities', function() {
			resource.entities = [{
				rel: ['foo'],
				title: 'bar'
			}];
			siren = buildEntity();
			expect(siren.getSubEntity('foo')).to.be.an.instanceof(Entity);
		});

		it('should correctly identify link sub-entities', function() {
			resource.entities = [{
				rel: ['foo'],
				href: 'bar'
			}];
			siren = buildEntity();
			expect(siren.getSubEntity('foo')).to.be.an.instanceof(Link);
		});

		it('should not duplicate sub-entities with the same rel', function() {
			resource.entities = [{
				rel: ['foo', 'bar']
			}];
			siren = buildEntity();
			expect(siren.getSubEntity('foo')).to.equal(siren.getSubEntity('bar'));
		});

		describe('getSubEntityByClass/getSubEntitiesByClass', function() {
			beforeEach('', function() {
				resource.entities = [{
					class: ['foo'],
					rel: ['bar'],
					title: 'baz'
				}, {
					class: ['foo', 'foo2'],
					rel: ['bar2'],
					title: 'baz2'
				}];
				siren = buildEntity();
			});

			it('should retrieve the first sub-entity with a given class', function() {
				expect(siren.getSubEntityByClass('foo')).to.have.property('title', 'baz');
			});

			it('should retrieve all sub-entities with a given class', function() {
				expect(siren.getSubEntitiesByClass('foo')).to.be.an.instanceof(Array).with.lengthOf(2);
			});

			it('should return a new array when retrieving all sub-entities', function() {
				expect(siren.getSubEntitiesByClass('foo')).to.not.equal(siren.getSubEntitiesByClass('foo'));
			});

			describe('when there is no sub-entity of the given class', function() {
				it('should return undefined when retrieving the first sub-entity', function() {
					expect(siren.getSubEntityByClass('baz')).to.not.be.defined;
				});

				it('should return an empty array when retrieving all sub-entities', function() {
					expect(siren.getSubEntitiesByClass('baz'))
						.to.be.an.instanceof(Array)
						.and.to.be.empty;
				});
			});
		});

		describe('getSubEntity/getSubEntities', function() {
			beforeEach('', function() {
				resource.entities = [{
					rel: ['foo'],
					title: 'bar'
				}, {
					rel: ['foo', 'foo2'],
					href: 'bar2'
				}];
				siren = buildEntity();
			});

			it('should be able to retieve the first sub-entity with a given rel', function() {
				expect(siren.getSubEntity('foo')).to.have.property('title', 'bar');
			});

			it('should be able to retrieve all sub-entities with a given rel', function() {
				expect(siren.getSubEntities('foo')).to.be.an.instanceof(Array).with.lengthOf(2);
			});

			it('should return a new array when retrieving all sub-entities', function() {
				expect(siren.getSubEntities('foo')).to.not.equal(siren.getSubEntities('foo'));
			});

			describe('when there is no sub-entity of the given rel', function() {
				it('should return undefined when retrieving the first sub-entity', function() {
					expect(siren.getSubEntity('baz')).to.not.be.defined;
				});

				it('should return an empty array when retrieving all sub-entities', function() {
					expect(siren.getSubEntities('baz'))
						.to.be.an.instanceof(Array)
						.and.to.be.empty;
				});
			});
		});
	});
});
