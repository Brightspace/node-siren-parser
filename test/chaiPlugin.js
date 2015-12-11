/* global describe, it, beforeEach */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	Action = require('../src/Action'),
	Entity = require('../'),
	Field = require('../src/Field'),
	Link = require('../src/Link'),
	sirenChai = require('../chai');

chai.use(sirenChai);

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
