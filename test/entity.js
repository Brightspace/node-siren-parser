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
	});

	describe('helper functions', function() {
		describe('has...', function() {
			describe('Action', function() {
				it('hasActionByName (hasAction)', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar'
					}];
					siren = buildEntity();
					expect(siren.hasAction('foo')).to.be.true;

					resource.actions = undefined;
					siren = buildEntity();
					expect(siren.hasAction('foo')).to.be.false;
				});

				it('hasActionByClass', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						class: ['baz']
					}];
					siren = buildEntity();
					expect(siren.hasActionByClass('baz')).to.be.true;

					resource.actions = undefined;
					siren = buildEntity();
					expect(siren.hasActionByClass('baz')).to.be.false;
				});
			});

			describe('Class', function() {
				it('hasClass', function() {
					resource.class = ['foo'];
					siren = buildEntity();
					expect(siren.hasClass('foo')).to.be.true;

					resource.class = undefined;
					siren = buildEntity();
					expect(siren.hasClass('foo')).to.be.false;
				});
			});

			describe('Entity', function() {
				it('hasEntityByRel (hasEntity)', function() {
					resource.entities = [{
						rel: ['foo']
					}];
					siren = buildEntity();
					expect(siren.hasEntity('foo')).to.be.true;

					resource.entities = undefined;
					siren = buildEntity();
					expect(siren.hasEntity('foo')).to.be.false;
				});

				it('hasEntityByClass', function() {
					resource.entities = [{
						rel: ['foo'],
						class: ['bar']
					}];
					siren = buildEntity();
					expect(siren.hasEntityByClass('bar')).to.be.true;

					resource.entities = undefined;
					siren = buildEntity();
					expect(siren.hasEntityByClass('bar')).to.be.false;
				});

				it('hasEntityByType', function() {
					resource.entities = [{
						rel: ['foo'],
						type: 'bar'
					}];
					siren = buildEntity();
					expect(siren.hasEntityByType('bar')).to.be.true;

					resource.entities = undefined;
					siren = buildEntity();
					expect(siren.hasEntityByType('bar')).to.be.false;
				});
			});

			describe('Link', function() {
				it('hasLinkByRel (hasLink)', function() {
					resource.links = [{
						rel: ['foo'],
						href: 'bar'
					}];
					siren = buildEntity();
					expect(siren.hasLink('foo')).to.be.true;

					resource.links = undefined;
					siren = buildEntity();
					expect(siren.hasLink('foo')).to.be.false;
				});

				it('hasLinkByClass', function() {
					resource.links = [{
						rel: ['foo'],
						href: 'bar',
						class: ['baz']
					}];
					siren = buildEntity();
					expect(siren.hasLinkByClass('baz')).to.be.true;

					resource.links = undefined;
					siren = buildEntity();
					expect(siren.hasLinkByClass('baz')).to.be.false;
				});

				it('hasLinkByType', function() {
					resource.links = [{
						rel: ['foo'],
						href: 'bar',
						type: 'baz'
					}];
					siren = buildEntity();
					expect(siren.hasLinkByType('baz')).to.be.true;

					resource.links = undefined;
					siren = buildEntity();
					expect(siren.hasLinkByType('baz')).to.be.false;
				});
			});

			describe('Property', function() {
				it('hasProperty', function() {
					resource.properties = { foo: 'bar' };
					siren = buildEntity();
					expect(siren.hasProperty('foo')).to.be.true;

					resource.properties = undefined;
					siren = buildEntity();
					expect(siren.hasProperty('foo')).to.be.false;
				});
			});
		});

		describe('get...', function() {
			describe('Action', function() {
				it('getActionByName (getAction)', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar'
					}];
					siren = buildEntity();
					expect(siren.getAction('foo')).to.have.property('href', 'bar');
				});

				it('getActionByClass', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						class: ['baz']
					}];
					siren = buildEntity();
					expect(siren.getActionByClass('baz')).to.have.property('href', 'bar');
				});

				it('getActionsByClass', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						class: ['baz']
					}, {
						name: 'foo2',
						href: 'bar2',
						class: ['baz']
					}];
					siren = buildEntity();
					expect(siren.getActionsByClass('baz')).to.have.lengthOf(2);
				});
			});

			describe('Link', function() {
				beforeEach(function() {
					resource.links = [{
						rel: ['foo'],
						href: 'bar',
						class: ['baz'],
						type: 'quux'
					}, {
						rel: ['foo', 'foo2'],
						href: 'bar2',
						class: ['baz'],
						type: 'quux'
					}];
					siren = buildEntity();
				});

				it('getLinkByRel (getLink)', function() {
					expect(siren.getLink('foo')).to.have.property('href', 'bar');
					expect(siren.getLink('nope')).to.be.undefined;
				});

				it('getLinksByRel (getLinks)', function() {
					expect(siren.getLinks('foo')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinks('nope')).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getLinks should return a new array', function() {
					expect(siren.getLinks('foo')).to.not.equal(siren.getLinks('foo'));
				});

				it('getLinkByClass', function() {
					expect(siren.getLinkByClass('baz')).to.have.property('href', 'bar');
					expect(siren.getLinkByClass('nope')).to.be.undefined;
				});

				it('getLinksByClass', function() {
					expect(siren.getLinksByClass('baz')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinksByClass('nope')).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getLinkByType', function() {
					expect(siren.getLinkByType('quux')).to.have.property('href', 'bar');
					expect(siren.getLinkByType('nope')).to.be.undefined;
				});

				it('getLinksByType', function() {
					expect(siren.getLinksByType('quux')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinksByType('nope')).to.be.an.instanceof(Array).and.to.be.empty;
				});
			});

			describe('Entity', function() {
				beforeEach(function() {
					resource.entities = [{
						rel: ['foo'],
						title: 'bar',
						class: ['baz'],
						type: 'quux'
					}, {
						rel: ['foo', 'foo2'],
						title: 'bar2',
						class: ['baz'],
						type: 'quux'
					}];
					siren = buildEntity();
				});

				it('getSubEntityByRel (getSubEntity)', function() {
					expect(siren.getSubEntity('foo')).to.have.property('title', 'bar');
					expect(siren.getSubEntity('nope')).to.be.undefined;
				});

				it('getSubEntitiesByRel (getSubEntities)', function() {
					expect(siren.getSubEntities('foo')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntities('nope')).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getSubEntities should return a new array', function() {
					expect(siren.getSubEntities('foo')).to.not.equal(siren.getSubEntities('foo'));
				});

				it('getSubEntityByClass', function() {
					expect(siren.getSubEntityByClass('baz')).to.have.property('title', 'bar');
					expect(siren.getSubEntityByClass('nope')).to.be.undefined;
				});

				it('getSubEntitiesByClass', function() {
					expect(siren.getSubEntitiesByClass('baz')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntitiesByClass('nope')).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getSubEntityByType', function() {
					expect(siren.getSubEntityByType('quux')).to.have.property('title', 'bar');
					expect(siren.getSubEntityByType('nope')).to.be.undefined;
				});

				it('getSubEntitiesByType', function() {
					expect(siren.getSubEntitiesByType('quux')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntitiesByType('nope')).to.be.an.instanceof(Array).and.to.be.empty;
				});
			});
		});
	});
});
