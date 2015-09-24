/* global describe, it, beforeEach, afterEach */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon');

const
	Action = require('../src/Action'),
	Entity = require('../src/index'),
	Link = require('../src/Link');

chai.use(require('sinon-chai'));

describe('Siren Parser', function () {
	let
		resource,
		sandbox,
		siren;

	beforeEach(function () {
		resource = {};
		siren = undefined;
		sandbox = sinon.sandbox.create();
		sandbox.stub(console, 'error');
		sandbox.stub(console, 'warn');
	});

	afterEach(function () {
		sandbox.restore();
	});

	describe('Entity', function () {
		function buildEntity () {
			return new Entity(resource);
		}

		it('should work with stringified entity', function () {
			resource = '{}';
			expect(buildEntity()).to.be.an('object');
		});

		describe('title', function () {
			it('should parse title', function () {
				resource.title = 'A title!';
				siren = buildEntity();
				expect(siren.title).to.equal('A title!');
			});

			it('should require title be a string, if supplied', function () {
				resource.title = 1;
				expect(buildEntity.bind()).to.throw();
			});
		});

		describe('type', function () {
			it('should parse type', function () {
				resource.type = 'foo';
				siren = buildEntity();
				expect(siren.type).to.equal('foo');
			});

			it('should require type be a string, if supplied', function () {
				resource.type = 1;
				expect(buildEntity.bind()).to.throw();
			});
		});

		describe('properties', function () {
			it('should parse properties', function () {
				resource.properties = {};
				siren = buildEntity();
				expect(siren.properties).to.be.an('object');
			});

			it('should require properties be an object, if supplied', function () {
				resource.properties = 1;
				expect(buildEntity.bind()).to.throw();
			});
		});

		describe('class', function () {
			it('should parse class', function () {
				resource.class = [];
				siren = buildEntity();
				expect(siren.class).to.be.an.instanceof(Array);
			});

			it('should require class be an array, if supplied', function () {
				resource.class = 1;
				expect(buildEntity.bind()).to.throw();
			});
		});

		describe('actions', function () {
			it('should parse actions', function () {
				resource.actions = [],
				siren = buildEntity();
				expect(siren.actions).to.be.an.instanceof(Array);
			});

			it('should require actions be an array, if supplied', function () {
				resource.actions = 1;
				expect(buildEntity.bind()).to.throw();
			});

			it('should be able to retrieve actions based off their name', function () {
				resource.actions = [{
					name: 'foo',
					href: 'bar'
				}];
				siren = buildEntity();
				expect(siren.getAction('foo')).to.have.property('href', 'bar');
			});
		});

		describe('links', function () {
			it('should parse links', function () {
				resource.links = [],
				siren = buildEntity();
				expect(siren.links).to.be.an.instanceof(Array);
			});

			it('should require links be an array, if supplied', function () {
				resource.links = 1;
				expect(buildEntity.bind()).to.throw();
			});

			it('should be able to retrieve links based off their rel', function () {
				resource.links = [{
					rel: ['foo'],
					href: 'bar'
				}];
				siren = buildEntity();
				expect(siren.getLink('foo')).to.have.property('href', 'bar');
			});
		});

		describe('(sub)entities', function () {
			it('should parse (sub)entities', function () {
				resource.entities = [];
				siren = buildEntity();
				expect(siren.entities).to.be.an.instanceof(Array);
			});

			it('should require (sub)entities be an array, if supplied', function () {
				resource.entities = 1;
				expect(buildEntity.bind()).to.throw();
			});

			it('should require (sub)entities have a rel', function () {
				resource.entities = [{
					foo: 'bar'
				}];
				expect(buildEntity.bind()).to.throw();
			});

			it('should be able to retieve sub-entities based off their rel', function () {
				resource.entities = [{
					rel: ['foo'],
					title: 'bar'
				}];
				siren = buildEntity();
				expect(siren.getSubEntity('foo')).to.have.property('title', 'bar');
			});

			it('should correctly identify link sub-entities', function () {
				resource.entities = [{
					rel: ['foo'],
					href: 'bar'
				}];
				siren = buildEntity();
				expect(siren.getSubEntity('foo')).to.be.an.instanceof(Link);
			});

			it('should correctly identify entity sub-entities', function () {
				resource.entities = [{
					rel: ['foo']
				}];
				siren = buildEntity();
				expect(siren.getSubEntity('foo')).to.be.an.instanceof(Entity);
			});

			it('should not duplicate sub-entities with the same rel', function () {
				resource.entities = [{
					rel: ['foo', 'bar']
				}];
				siren = buildEntity();
				expect(siren.getSubEntity('foo')).to.equal(siren.getSubEntity('bar'));
			});

			it('should work with chained Entity/Action/Links', function () {
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
		});
	});

	describe('Action', function () {
		function buildAction () {
			return new Action(resource);
		}

		beforeEach(function () {
			resource = {
				name: 'foo',
				href: 'bar'
			};
		});

		it('should require the action be an object', function () {
			resource = 1;
			expect(buildAction.bind()).to.throw();
		});

		describe('name', function () {
			it('should require a name', function () {
				resource.name = undefined;
				expect(buildAction.bind()).to.throw();
			});

			it('should require name be a string', function () {
				resource.name = 1;
				expect(buildAction.bind()).to.throw();
			});

			it('should parse name', function () {
				siren = buildAction();
				expect(siren.name).to.equal('foo');
			});
		});

		describe('href', function () {
			it('should require a href', function () {
				resource.href = undefined;
				expect(buildAction.bind()).to.throw();
			});

			it('should require href be a string', function () {
				resource.href = 1;
				expect(buildAction.bind()).to.throw();
			});

			it('should parse href', function () {
				siren = buildAction();
				expect(siren.href).to.equal('bar');
			});
		});

		describe('class', function () {
			it('should parse class', function () {
				resource.class = [];
				siren = buildAction();
				expect(siren.class).to.be.an.instanceof(Array);
			});

			it('should require class be an array, if supplied', function () {
				resource.class = 1;
				expect(buildAction.bind()).to.throw();
			});
		});

		describe('method', function () {
			it('should parse method', function () {
				resource.method = 'baz';
				siren = buildAction();
				expect(siren.method).to.equal('baz');
			});

			it('should require method be a string, if supplied', function () {
				resource.method = 1;
				expect(buildAction.bind(undefined, resource)).to.throw();
			});
		});

		describe('title', function () {
			it('should parse title', function () {
				resource.title = 'baz';
				siren = buildAction();
				expect(siren.title).to.equal('baz');
			});

			it('should require title be a string, if supplied', function () {
				resource.title = 1;
				expect(buildAction.bind(undefined, resource)).to.throw();
			});
		});

		describe('type', function () {
			it('should parse type', function () {
				resource.type = 'baz';
				siren = buildAction();
				expect(siren.type).to.equal('baz');
			});

			it('should require type be a string, if supplied', function () {
				resource.type = 1;
				expect(buildAction.bind(undefined, resource)).to.throw();
			});
		});

		describe('fields', function () {
			it('should parse fields', function () {
				resource.fields = [];
				siren = buildAction();
				expect(siren.fields).to.be.an.instanceof(Array);
			});

			it('should require fields be an array, if supplied', function () {
				resource.fields = 1;
				expect(buildAction.bind(undefined, resource)).to.throw();
			});
		});
	});

	describe('Link', function () {
		function buildLink () {
			return new Link(resource);
		}

		beforeEach(function () {
			resource = {
				rel: [],
				href: 'foo'
			};
		});

		it('should require the link be an object', function () {
			resource = 1;
			expect(buildLink.bind()).to.throw();
		});

		describe('rel', function () {
			it('should require a rel', function () {
				resource.rel = undefined;
				expect(buildLink.bind()).to.throw();
			});

			it('should require rel be an array', function () {
				resource.rel = 1;
				expect(buildLink.bind()).to.throw();
			});

			it('should parse rel', function () {
				siren = buildLink();
				expect(siren.rel).to.be.an.instanceof(Array);
			});
		});

		describe('href', function () {
			it('should require a href', function () {
				resource.href = undefined;
				expect(buildLink.bind()).to.throw();
			});

			it('should require href be a string', function () {
				resource.href = 1;
				expect(buildLink.bind()).to.throw();
			});

			it('should parse href', function () {
				siren = buildLink();
				expect(siren.href).to.equal('foo');
			});
		});

		describe('class', function () {
			it('should parse class', function () {
				resource.class = [];
				siren = buildLink();
				expect(siren.class).to.be.an.instanceof(Array);
			});

			it('should require class be an array, if supplied', function () {
				resource.class = 1;
				expect(buildLink.bind()).to.throw();
			});
		});

		describe('title', function () {
			it('should parse title', function () {
				resource.title = 'baz';
				siren = buildLink();
				expect(siren.title).to.equal('baz');
			});

			it('should require title be a string, if supplied', function () {
				resource.title = 1;
				expect(buildLink.bind(undefined, resource)).to.throw();
			});
		});

		describe('type', function () {
			it('should parse type', function () {
				resource.type = 'baz';
				siren = buildLink();
				expect(siren.type).to.equal('baz');
			});

			it('should require type be a string, if supplied', function () {
				resource.type = 1;
				expect(buildLink.bind(undefined, resource)).to.throw();
			});
		});
	});
});
