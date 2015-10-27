/* global describe, it, beforeEach, afterEach */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect,
	nock = require('nock'),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),
	request = require('supertest');

const
	Action = require('../src/Action'),
	Entity = require('../src/index'),
	Field = require('../src/Field'),
	Link = require('../src/Link'),
	sirenChai = require('../src/chaiPlugin'),
	sirenSuperagent = require('../src/superagent');

chai.use(sinonChai);
chai.use(sirenChai);

describe('Siren Parser', function() {
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

	describe('Entity', function() {
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

			it('should be able to retrieve links based off their rel', function() {
				resource.links = [{
					rel: ['foo'],
					href: 'bar'
				}];
				siren = buildEntity();
				expect(siren.getLink('foo')).to.have.property('href', 'bar');
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

			it('should be able to retieve sub-entities based off their rel', function() {
				resource.entities = [{
					rel: ['foo'],
					title: 'bar'
				}];
				siren = buildEntity();
				expect(siren.getSubEntity('foo')).to.have.property('title', 'bar');
			});

			it('should correctly identify link sub-entities', function() {
				resource.entities = [{
					rel: ['foo'],
					href: 'bar'
				}];
				siren = buildEntity();
				expect(siren.getSubEntity('foo')).to.be.an.instanceof(Link);
			});

			it('should correctly identify entity sub-entities', function() {
				resource.entities = [{
					rel: ['foo']
				}];
				siren = buildEntity();
				expect(siren.getSubEntity('foo')).to.be.an.instanceof(Entity);
			});

			it('should be able to retrieve sub-entities based off their class', function() {
				resource.entities = [{
					rel: ['foo'],
					class: ['bar', 'baz']
				}];
				siren = buildEntity();
				expect(siren.getSubEntitiesByClass('bar')).to.be.an.instanceof(Array);
				expect(siren.getSubEntitiesByClass('bar')[0].hasClass('baz')).to.equal.true;
			});

			it('should not duplicate sub-entities with the same rel', function() {
				resource.entities = [{
					rel: ['foo', 'bar']
				}];
				siren = buildEntity();
				expect(siren.getSubEntity('foo')).to.equal(siren.getSubEntity('bar'));
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
		});
	});

	describe('Action', function() {
		function buildAction() {
			return new Action(resource);
		}

		beforeEach(function() {
			resource = {
				name: 'foo',
				href: 'bar'
			};
		});

		it('should auto-instantiate', function() {
			expect(Action(resource)).to.be.an.instanceof(Action);
		});

		it('should require the action be an object', function() {
			resource = 1;
			expect(buildAction.bind()).to.throw();
		});

		describe('name', function() {
			it('should require a name', function() {
				resource.name = undefined;
				expect(buildAction.bind()).to.throw();
			});

			it('should require name be a string', function() {
				resource.name = 1;
				expect(buildAction.bind()).to.throw();
			});

			it('should parse name', function() {
				siren = buildAction();
				expect(siren.name).to.equal('foo');
			});
		});

		describe('href', function() {
			it('should require a href', function() {
				resource.href = undefined;
				expect(buildAction.bind()).to.throw();
			});

			it('should require href be a string', function() {
				resource.href = 1;
				expect(buildAction.bind()).to.throw();
			});

			it('should parse href', function() {
				siren = buildAction();
				expect(siren.href).to.equal('bar');
			});
		});

		describe('class', function() {
			it('should parse class', function() {
				resource.class = [];
				siren = buildAction();
				expect(siren.class).to.be.an.instanceof(Array);
			});

			it('should require class be an array, if supplied', function() {
				resource.class = 1;
				expect(buildAction.bind()).to.throw();
			});

			it('should be able to determine if an action has a given class', function() {
				resource.class = ['foo'];
				siren = buildAction();
				expect(siren.hasClass('foo')).to.be.true;

				resource.class = undefined;
				siren = buildAction();
				expect(siren.hasClass('foo')).to.be.false;
			});
		});

		describe('method', function() {
			it('should parse method', function() {
				resource.method = 'baz';
				siren = buildAction();
				expect(siren.method).to.equal('baz');
			});

			it('should require method be a string, if supplied', function() {
				resource.method = 1;
				expect(buildAction.bind(undefined, resource)).to.throw();
			});
		});

		describe('title', function() {
			it('should parse title', function() {
				resource.title = 'baz';
				siren = buildAction();
				expect(siren.title).to.equal('baz');
			});

			it('should require title be a string, if supplied', function() {
				resource.title = 1;
				expect(buildAction.bind(undefined, resource)).to.throw();
			});
		});

		describe('type', function() {
			it('should parse type', function() {
				resource.type = 'baz';
				siren = buildAction();
				expect(siren.type).to.equal('baz');
			});

			it('should require type be a string, if supplied', function() {
				resource.type = 1;
				expect(buildAction.bind(undefined, resource)).to.throw();
			});
		});

		describe('fields', function() {
			it('should parse fields', function() {
				resource.fields = [];
				siren = buildAction();
				expect(siren.fields).to.be.an.instanceof(Array);
			});

			it('should require fields be an array, if supplied', function() {
				resource.fields = 1;
				expect(buildAction.bind(undefined, resource)).to.throw();
			});

			it('should be able to determine if an Action has a given Field', function() {
				resource.fields = [{
					name: 'foo'
				}];
				siren = buildAction();
				expect(siren.hasField('foo')).to.be.true;
			});

			it('should be able to retrieve fields based off their name', function() {
				resource.fields = [{
					name: 'foo',
					title: 'bar'
				}];
				siren = buildAction();
				expect(siren.getField('foo')).to.have.property('title', 'bar');
			});

			it('extendFields should extend given fields object with default values', function() {
				resource.fields = [{
					name: 'foo1',
					value: 'bar'
				}, {
					name: 'foo2',
					value: 'bar'
				}];
				siren = buildAction();
				expect(siren.extendFields({
					foo1: 'notbar'
				})).to.deep.equal({
					foo1: 'notbar',
					foo2: 'bar'
				});
			});
		});
	});

	describe('Field', function() {
		function buildField() {
			return new Field(resource);
		}

		beforeEach(function() {
			resource = {
				name: 'foo'
			};
		});

		it('should auto-instantiate', function() {
			expect(Field(resource)).to.be.an.instanceof(Field);
		});

		it('should require the field be an object', function() {
			resource = 1;
			expect(buildField.bind()).to.throw();
		});

		describe('name', function() {
			it('should require a name', function() {
				resource.name = undefined;
				expect(buildField.bind()).to.throw();
			});

			it('should require name be a string', function() {
				resource.name = 1;
				expect(buildField.bind()).to.throw();
			});

			it('should parse name', function() {
				siren = buildField();
				expect(siren.name).to.equal('foo');
			});
		});

		describe('value', function() {
			it('should parse value', function() {
				resource.value = 'foo';
				siren = buildField();
				expect(siren.value).to.equal('foo');
			});
		});

		describe('class', function() {
			it('should parse class', function() {
				resource.class = [];
				siren = buildField();
				expect(siren.class).to.be.an.instanceof(Array);
			});

			it('should require class be an array, if supplied', function() {
				resource.class = 1;
				expect(buildField.bind()).to.throw();
			});

			it('should be able to determine if a field has a given class', function() {
				resource.class = ['foo'];
				siren = buildField();
				expect(siren.hasClass('foo')).to.be.true;

				resource.class = undefined;
				siren = buildField();
				expect(siren.hasClass('foo')).to.be.false;
			});
		});

		describe('title', function() {
			it('should parse title', function() {
				resource.title = 'bar';
				siren = buildField();
				expect(siren.title).to.equal('bar');
			});

			it('should require title be a string, if supplied', function() {
				resource.title = 1;
				expect(buildField.bind(undefined, resource)).to.throw();
			});
		});

		describe('type', function() {
			it('should parse type', function() {
				resource.type = 'text';
				siren = buildField();
				expect(siren.type).to.equal('text');
			});

			it('should require type be a string, if supplied', function() {
				resource.type = 1;
				expect(buildField.bind(undefined, resource)).to.throw();
			});

			it('should require type be a valid HTML5 input type, if specified', function() {
				resource.type = 'bar';
				expect(buildField.bind()).to.throw();
			});
		});
	});

	describe('Link', function() {
		function buildLink() {
			return new Link(resource);
		}

		beforeEach(function() {
			resource = {
				rel: [],
				href: 'foo'
			};
		});

		it('should auto-instantiate', function() {
			expect(Link(resource)).to.be.an.instanceof(Link);
		});

		it('should require the link be an object', function() {
			resource = 1;
			expect(buildLink.bind()).to.throw();
		});

		describe('rel', function() {
			it('should require a rel', function() {
				resource.rel = undefined;
				expect(buildLink.bind()).to.throw();
			});

			it('should require rel be an array', function() {
				resource.rel = 1;
				expect(buildLink.bind()).to.throw();
			});

			it('should parse rel', function() {
				siren = buildLink();
				expect(siren.rel).to.be.an.instanceof(Array);
			});
		});

		describe('href', function() {
			it('should require a href', function() {
				resource.href = undefined;
				expect(buildLink.bind()).to.throw();
			});

			it('should require href be a string', function() {
				resource.href = 1;
				expect(buildLink.bind()).to.throw();
			});

			it('should parse href', function() {
				siren = buildLink();
				expect(siren.href).to.equal('foo');
			});
		});

		describe('class', function() {
			it('should parse class', function() {
				resource.class = [];
				siren = buildLink();
				expect(siren.class).to.be.an.instanceof(Array);
			});

			it('should require class be an array, if supplied', function() {
				resource.class = 1;
				expect(buildLink.bind()).to.throw();
			});

			it('should be able to determine if a link has a given class', function() {
				resource.class = ['foo'];
				siren = buildLink();
				expect(siren.hasClass('foo')).to.be.true;

				resource.class = undefined;
				siren = buildLink();
				expect(siren.hasClass('foo')).to.be.false;
			});
		});

		describe('title', function() {
			it('should parse title', function() {
				resource.title = 'baz';
				siren = buildLink();
				expect(siren.title).to.equal('baz');
			});

			it('should require title be a string, if supplied', function() {
				resource.title = 1;
				expect(buildLink.bind(undefined, resource)).to.throw();
			});
		});

		describe('type', function() {
			it('should parse type', function() {
				resource.type = 'baz';
				siren = buildLink();
				expect(siren.type).to.equal('baz');
			});

			it('should require type be a string, if supplied', function() {
				resource.type = 1;
				expect(buildLink.bind(undefined, resource)).to.throw();
			});
		});
	});
});

describe('Chai Plugin', function() {
	let
		action,
		entity,
		field,
		link,
		subEntity;

	beforeEach(function() {
		field = new Field({
			name: 'field-foo',
			type: 'text'
		});
		action = new Action({
			name: 'action-foo',
			href: 'http://example.com',
			fields: [field]
		});
		link = new Link({
			rel: ['rel-foo', 'rel-bar'],
			href: 'http://example.com'
		});
		subEntity = new Entity({
			rel: ['sub-rel-foo', 'sub-rel-bar'],
			class: ['sub-class-foo', 'sub-class-bar'],
			title: 'sub-title-foo'
		});

		entity = new Entity({
			class: ['class-foo', 'class-bar'],
			properties: {
				one: 1,
				two: 2
			},
			actions: [action],
			links: [link],
			entities: [subEntity]
		});
	});

	describe('Action', function() {
		it('expect().to.be.a.siren("action")', function() {
			expect(action).to.be.a.siren('action');
			expect(field).to.not.be.a.siren('action');
			expect(function() {
				expect(field).to.be.a.siren('action');
			}).to.throw();
		});

		it('expect().to.have.sirenAction()', function() {
			expect(entity).to.have.sirenAction('action-foo');
			expect(entity).to.have.sirenAction('action-foo').with.property('href', 'http://example.com');
			expect(entity).to.not.have.sirenAction('action-bar');
			expect(function() {
				expect(entity).to.have.sirenAction('action-bar');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenAction('action-foo');
			}).to.throw();
		});

		it('expect().to.have.sirenActions()', function() {
			expect(entity).to.have.sirenActions(['action-foo']);
			expect(entity).to.not.have.sirenActions(['action-bar']);
			expect(function() {
				expect(entity).to.have.sirenActions(['action-bar']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenActions(['action-foo']);
			}).to.throw();
		});
	});

	describe('Class', function() {
		it('expect().to.be.a.siren("class")', function() {
			expect(entity.class).to.be.a.siren('class');
			expect(entity.actions).to.not.be.a.siren('class');
			expect(function() {
				expect(entity.class).to.not.be.a.siren('class');
			}).to.throw();
			expect(function() {
				expect(entity.actions).to.be.a.siren('class');
			}).to.throw();
		});

		it('expect().to.have.sirenClass()', function() {
			expect(entity).to.have.sirenClass('class-foo');
			expect(entity).to.not.have.sirenClass('foo');
			expect(function() {
				expect(entity).to.have.sirenClass('foo');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenClass('class-foo');
			}).to.throw();
		});

		it('expect().to.have.sirenClasses()', function() {
			expect(entity).to.have.sirenClasses(['class-foo', 'class-bar']);
			expect(entity).to.not.have.sirenClasses(['foo', 'bar']);
			expect(function() {
				expect(entity).to.have.sirenClasses(['class-foo', 'bar']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenClasses(['class-foo', 'class-bar']);
			}).to.throw();
		});
	});

	describe('Entity', function() {
		it('expect().to.be.a.siren("entity")', function() {
			expect(entity).to.be.a.siren('entity');
			expect(action).to.not.be.a.siren('entity');
			expect(function() {
				expect(action).to.be.a.siren('entity');
			}).to.throw();
		});

		it('expect().to.have.sirenEntity()', function() {
			expect(entity).to.have.sirenEntity('sub-rel-foo');
			expect(entity).to.have.sirenEntity('sub-rel-foo').with.property('title', 'sub-title-foo');
			expect(entity).to.not.have.sirenEntity('foo');
			expect(function() {
				expect(entity).to.have.sirenEntity('foo');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenEntity('sub-rel-foo');
			}).to.throw();
		});

		it('expect().to.have.sirenEntities()', function() {
			expect(entity).to.have.sirenEntities(['sub-rel-foo', 'sub-rel-bar']);
			expect(entity).to.not.have.sirenEntities(['foo', 'bar']);
			expect(function() {
				expect(entity).to.have.sirenEntities(['sub-rel-foo', 'foo']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenEntities(['sub-rel-foo', 'bar']);
			}).to.throw();
		});
	});

	describe('Field', function() {
		it('expect().to.be.a.siren("field")', function() {
			expect(field).to.be.a.siren('field');
			expect(link).to.not.be.a.siren('field');
			expect(function() {
				expect(link).to.be.a.siren('field');
			}).to.throw();
		});

		it('expect().to.have.sirenField()', function() {
			expect(entity.getAction('action-foo')).to.have.sirenField('field-foo');
			expect(entity.getAction('action-foo')).to.have.sirenField('field-foo').with.property('type', 'text');
			expect(entity.getAction('action-foo')).to.not.have.sirenField('foo');
			expect(function() {
				expect(entity.getAction('action-foo')).to.have.sirenField('foo');
			}).to.throw();
			expect(function() {
				expect(entity.getAction('action-foo')).to.not.have.sirenField('field-foo');
			}).to.throw();
		});

		it('expect().to.have.sirenFields()', function() {
			expect(entity.getAction('action-foo')).to.have.sirenFields(['field-foo']);
			expect(entity.getAction('action-foo')).to.not.have.sirenFields(['field-bar']);
			expect(function() {
				expect(entity.getAction('action-foo')).to.have.sirenFields(['field-bar']);
			}).to.throw();
			expect(function() {
				expect(entity.getAction('action-foo')).to.not.have.sirenFields(['field-foo']);
			}).to.throw();
		});
	});

	describe('Link', function() {
		it('expect().to.be.a.siren("link")', function() {
			expect(link).to.be.a.siren('link');
			expect(entity).to.not.be.a.siren('link');
			expect(function() {
				expect(entity).to.be.a.siren('link');
			}).to.throw();
		});

		it('expect().to.have.sirenLink()', function() {
			expect(entity).to.have.sirenLink('rel-foo');
			expect(entity).to.have.sirenLink('rel-foo').with.property('href', 'http://example.com');
			expect(entity).to.not.have.sirenLink('foo');
			expect(function() {
				expect(entity).to.have.sirenLink('foo');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenLink('rel-foo');
			}).to.throw();
		});

		it('expect().to.have.sirenLinks()', function() {
			expect(entity).to.have.sirenLinks(['rel-foo', 'rel-bar']);
			expect(entity).to.not.have.sirenLinks(['foo', 'bar']);
			expect(function() {
				expect(entity).to.have.sirenLinks(['rel-foo', 'foo']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenLinks(['rel-foo', 'bar']);
			}).to.throw();
		});
	});

	describe('Property', function() {
		it('expect().to.have.sirenProperty()', function() {
			expect(entity).to.have.sirenProperty('one');
			expect(entity).to.have.sirenProperty('one').that.equals(1);
			expect(entity).to.not.have.sirenProperty('foo');
			expect(function() {
				expect(entity).to.have.sirenProperty('foo');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenProperty('one');
			}).to.throw();
		});

		it('expect().to.have.sirenProperties()', function() {
			expect(entity).to.have.sirenProperties(['one', 'two']);
			expect(entity).to.not.have.sirenProperties(['three', 'four']);
			expect(function() {
				expect(entity).to.have.sirenProperties(['one', 'three']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenProperties(['one', 'two']);
			}).to.throw();
		});
	});
});

describe('Siren Superagent Plugin', function() {
	let app, src;

	beforeEach(function() {
		app = undefined;
		src = 'http://localhost';
	});

	afterEach(function() {
		if (app) {
			expect(app.isDone()).to.be.true;
		}
	});

	describe('parser', function() {
		it('should parse a json body', function(done) {
			app = nock(src)
				.get('/')
				.reply(200, {});

			request(src)
				.get('/')
				.parse(sirenSuperagent.parse)
				.expect(200)
				.expect(function(res) {
					expect(res.body).to.be.an.instanceof(Entity);
				})
				.end(done);
		});

		// Emits a "double callback!" warning due to https://github.com/visionmedia/superagent/issues/633
		it('should throw an error when parsing fails', function(done) {
			app = nock(src)
				.get('/')
				.reply(200, 'not json');

			request(src)
				.get('/')
				.parse(sirenSuperagent.parse)
				.end(function(err, res) {
					expect(err).to.be.an.instanceof(SyntaxError);
					expect(res).to.be.undefined;
					done();
				});
		});

		it('should parse a string as a siren entity', function() {
			const entity = sirenSuperagent.parse('{}');
			expect(entity).to.be.an.instanceof(Entity);
		});
	});

	describe('perform action', function() {
		let resource;
		function buildAction() {
			return new Action(resource);
		}

		beforeEach(function() {
			resource = {
				name: 'foo',
				href: '/'
			};
		});

		it('should perform a basic action', function(done) {
			app = nock(src)
				.get('/')
				.reply(200);

			const action = buildAction();
			sirenSuperagent.perform(request(src), action)
				.expect(200)
				.end(done);
		});

		it('should perform a GET action with fields', function(done) {
			app = nock(src)
				.get('/')
				.query({query: 'parameter'})
				.reply(200);

			resource.method = 'GET';
			resource.fields = [
				{
					name: 'query',
					value: 'parameter'
				}
			];
			const action = buildAction();
			sirenSuperagent.perform(request(src), action)
				.expect(200)
				.end(done);
		});

		function testMethod(method) {
			it('should perform a ' + method + ' action with fields', function(done) {
				app = nock(src)
					[method.toLowerCase()]('/', 'query=parameter')
					.reply(200);

				resource.method = method;
				resource.fields = [
					{
						name: 'query',
						value: 'parameter'
					}
				];
				const action = buildAction();
				sirenSuperagent.perform(request(src), action)
					.expect(200)
					.end(done);
			});
		}

		testMethod('POST');
		testMethod('PUT');
		testMethod('PATCH');
		testMethod('DELETE');
	});
});
