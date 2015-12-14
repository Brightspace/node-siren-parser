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
			type: 'text',
			class: ['field-class-foo']
		});
		action = new Action({
			name: 'action-foo',
			href: 'http://example.com',
			fields: [field],
			class: ['action-class'],
			method: 'GET',
			type: 'application/x-www-form-urlencoded'
		});
		link = new Link({
			rel: ['rel-foo', 'rel-bar'],
			href: 'http://example.com',
			class: ['link-class-foo', 'link-class-bar'],
			type: 'link-type'
		});
		subEntity = new Entity({
			rel: ['sub-rel-foo', 'sub-rel-bar'],
			class: ['sub-class-foo', 'sub-class-bar'],
			title: 'sub-title-foo',
			type: 'sub-type'
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

		it('expect().to.have.sirenActionByName()', function() {
			expect(entity).to.have.sirenActionByName('action-foo');
			expect(entity).to.have.sirenActionByName('action-foo').with.property('href', 'http://example.com');
			expect(entity).to.not.have.sirenActionByName('action-bar');
			expect(function() {
				expect(entity).to.have.sirenActionByName('action-bar');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenActionByName('action-foo');
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

		it('expect().to.have.sirenActionsByName()', function() {
			expect(entity).to.have.sirenActionsByName(['action-foo']);
			expect(entity).to.not.have.sirenActionsByName(['action-bar']);
			expect(function() {
				expect(entity).to.have.sirenActionsByName(['action-bar']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenActionsByName(['action-foo']);
			}).to.throw();
		});

		it('expect().to.have.sirenActionByClass()', function() {
			expect(entity).to.have.sirenActionByClass('action-class');
			expect(entity).to.have.sirenActionByClass('action-class').with.property('href', 'http://example.com');
			expect(entity).to.not.have.sirenActionByClass('action-bar');
			expect(function() {
				expect(entity).to.have.sirenActionByClass('action-bar');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenActionByClass('action-class');
			}).to.throw();
		});

		it('expect().to.have.sirenActionsByClass()', function() {
			expect(entity).to.have.sirenActionsByClass(['action-class']);
			expect(entity).to.not.have.sirenActionsByClass(['action-bar']);
			expect(function() {
				expect(entity).to.have.sirenActionsByClass(['action-bar']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenActionsByClass(['action-class']);
			}).to.throw();
		});

		it('expect().to.have.sirenActionByMethod()', function() {
			expect(entity).to.have.sirenActionByMethod('GET');
			expect(entity).to.have.sirenActionByMethod('GET').with.property('href', 'http://example.com');
			expect(entity).to.not.have.sirenActionByMethod('action-bar');
			expect(function() {
				expect(entity).to.have.sirenActionByMethod('action-bar');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenActionByMethod('GET');
			}).to.throw();
		});

		it('expect().to.have.sirenActionsByMethod()', function() {
			expect(entity).to.have.sirenActionsByMethod(['GET']);
			expect(entity).to.not.have.sirenActionsByMethod(['action-bar']);
			expect(function() {
				expect(entity).to.have.sirenActionsByMethod(['action-bar']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenActionsByMethod(['GET']);
			}).to.throw();
		});

		it('expect().to.have.sirenActionByType()', function() {
			expect(entity).to.have.sirenActionByType('application/x-www-form-urlencoded');
			expect(entity).to.have.sirenActionByType('application/x-www-form-urlencoded').with.property('href', 'http://example.com');
			expect(entity).to.not.have.sirenActionByType('action-bar');
			expect(function() {
				expect(entity).to.have.sirenActionByType('action-bar');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenActionByType('application/x-www-form-urlencoded');
			}).to.throw();
		});

		it('expect().to.have.sirenActionsByType()', function() {
			expect(entity).to.have.sirenActionsByType(['application/x-www-form-urlencoded']);
			expect(entity).to.not.have.sirenActionsByType(['action-bar']);
			expect(function() {
				expect(entity).to.have.sirenActionsByType(['action-bar']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenActionsByType(['application/x-www-form-urlencoded']);
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

		it('expect().to.have.sirenEntityByRel()', function() {
			expect(entity).to.have.sirenEntityByRel('sub-rel-foo');
			expect(entity).to.have.sirenEntityByRel('sub-rel-foo').with.property('title', 'sub-title-foo');
			expect(entity).to.not.have.sirenEntityByRel('foo');
			expect(function() {
				expect(entity).to.have.sirenEntityByRel('foo');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenEntityByRel('sub-rel-foo');
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

		it('expect().to.have.sirenEntitiesByRel()', function() {
			expect(entity).to.have.sirenEntitiesByRel(['sub-rel-foo', 'sub-rel-bar']);
			expect(entity).to.not.have.sirenEntitiesByRel(['foo', 'bar']);
			expect(function() {
				expect(entity).to.have.sirenEntitiesByRel(['sub-rel-foo', 'foo']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenEntitiesByRel(['sub-rel-foo', 'bar']);
			}).to.throw();
		});

		it('expect().to.have.sirenEntityByClass()', function() {
			expect(entity).to.have.sirenEntityByClass('sub-class-foo');
			expect(entity).to.have.sirenEntityByClass('sub-class-foo').with.property('title', 'sub-title-foo');
			expect(entity).to.not.have.sirenEntityByClass('foo');
			expect(function() {
				expect(entity).to.have.sirenEntityByClass('foo');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenEntityByClass('sub-class-foo');
			}).to.throw();
		});

		it('expect().to.have.sirenEntitiesByClass()', function() {
			expect(entity).to.have.sirenEntitiesByClass(['sub-class-foo', 'sub-class-bar']);
			expect(entity).to.not.have.sirenEntitiesByClass(['foo', 'bar']);
			expect(function() {
				expect(entity).to.have.sirenEntitiesByClass(['sub-class-foo', 'foo']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenEntitiesByClass(['sub-class-foo', 'bar']);
			}).to.throw();
		});

		it('expect().to.have.sirenEntityByType()', function() {
			expect(entity).to.have.sirenEntityByType('sub-type');
			expect(entity).to.have.sirenEntityByType('sub-type').with.property('title', 'sub-title-foo');
			expect(entity).to.not.have.sirenEntityByType('foo');
			expect(function() {
				expect(entity).to.have.sirenEntityByType('foo');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenEntityByType('sub-type');
			}).to.throw();
		});

		it('expect().to.have.sirenEntitiesByType()', function() {
			expect(entity).to.have.sirenEntitiesByType(['sub-type']);
			expect(entity).to.not.have.sirenEntitiesByType(['foo', 'bar']);
			expect(function() {
				expect(entity).to.have.sirenEntitiesByType(['sub-type', 'foo']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenEntitiesByType(['sub-type', 'bar']);
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

		it('expect().to.have.sirenFieldByName()', function() {
			expect(entity.getAction('action-foo')).to.have.sirenFieldByName('field-foo');
			expect(entity.getAction('action-foo')).to.have.sirenFieldByName('field-foo').with.property('type', 'text');
			expect(entity.getAction('action-foo')).to.not.have.sirenFieldByName('foo');
			expect(function() {
				expect(entity.getAction('action-foo')).to.have.sirenFieldByName('foo');
			}).to.throw();
			expect(function() {
				expect(entity.getAction('action-foo')).to.not.have.sirenFieldByName('field-foo');
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

		it('expect().to.have.sirenFieldsByName()', function() {
			expect(entity.getAction('action-foo')).to.have.sirenFieldsByName(['field-foo']);
			expect(entity.getAction('action-foo')).to.not.have.sirenFieldsByName(['field-bar']);
			expect(function() {
				expect(entity.getAction('action-foo')).to.have.sirenFieldsByName(['field-bar']);
			}).to.throw();
			expect(function() {
				expect(entity.getAction('action-foo')).to.not.have.sirenFieldsByName(['field-foo']);
			}).to.throw();
		});

		it('expect().to.have.sirenFieldByClass()', function() {
			expect(entity.getAction('action-foo')).to.have.sirenFieldByClass('field-class-foo');
			expect(entity.getAction('action-foo')).to.have.sirenFieldByClass('field-class-foo').with.property('type', 'text');
			expect(entity.getAction('action-foo')).to.not.have.sirenFieldByClass('foo');
			expect(function() {
				expect(entity.getAction('action-foo')).to.have.sirenFieldByClass('foo');
			}).to.throw();
			expect(function() {
				expect(entity.getAction('action-foo')).to.not.have.sirenFieldByClass('field-class-foo');
			}).to.throw();
		});

		it('expect().to.have.sirenFieldsByClass()', function() {
			expect(entity.getAction('action-foo')).to.have.sirenFieldsByClass(['field-class-foo']);
			expect(entity.getAction('action-foo')).to.not.have.sirenFieldsByClass(['field-bar']);
			expect(function() {
				expect(entity.getAction('action-foo')).to.have.sirenFieldsByClass(['field-bar']);
			}).to.throw();
			expect(function() {
				expect(entity.getAction('action-foo')).to.not.have.sirenFieldsByClass(['field-class-foo']);
			}).to.throw();
		});

		it('expect().to.have.sirenFieldByType()', function() {
			expect(entity.getAction('action-foo')).to.have.sirenFieldByType('text');
			expect(entity.getAction('action-foo')).to.have.sirenFieldByType('text').with.property('type', 'text');
			expect(entity.getAction('action-foo')).to.not.have.sirenFieldByType('foo');
			expect(function() {
				expect(entity.getAction('action-foo')).to.have.sirenFieldByType('foo');
			}).to.throw();
			expect(function() {
				expect(entity.getAction('action-foo')).to.not.have.sirenFieldByType('text');
			}).to.throw();
		});

		it('expect().to.have.sirenFieldsByType()', function() {
			expect(entity.getAction('action-foo')).to.have.sirenFieldsByType(['text']);
			expect(entity.getAction('action-foo')).to.not.have.sirenFieldsByType(['field-bar']);
			expect(function() {
				expect(entity.getAction('action-foo')).to.have.sirenFieldsByType(['field-bar']);
			}).to.throw();
			expect(function() {
				expect(entity.getAction('action-foo')).to.not.have.sirenFieldsByType(['text']);
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

		it('expect().to.have.sirenLinkByRel()', function() {
			expect(entity).to.have.sirenLinkByRel('rel-foo');
			expect(entity).to.have.sirenLinkByRel('rel-foo').with.property('href', 'http://example.com');
			expect(entity).to.not.have.sirenLinkByRel('foo');
			expect(function() {
				expect(entity).to.have.sirenLinkByRel('foo');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenLinkByRel('rel-foo');
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

		it('expect().to.have.sirenLinksByRel()', function() {
			expect(entity).to.have.sirenLinksByRel(['rel-foo', 'rel-bar']);
			expect(entity).to.not.have.sirenLinksByRel(['foo', 'bar']);
			expect(function() {
				expect(entity).to.have.sirenLinksByRel(['rel-foo', 'foo']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenLinksByRel(['rel-foo', 'bar']);
			}).to.throw();
		});

		it('expect().to.have.sirenLinkByClass()', function() {
			expect(entity).to.have.sirenLinkByClass('link-class-foo');
			expect(entity).to.have.sirenLinkByClass('link-class-foo').with.property('href', 'http://example.com');
			expect(entity).to.not.have.sirenLinkByClass('foo');
			expect(function() {
				expect(entity).to.have.sirenLinkByClass('foo');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenLinkByClass('link-class-foo');
			}).to.throw();
		});

		it('expect().to.have.sirenLinksByClass()', function() {
			expect(entity).to.have.sirenLinksByClass(['link-class-foo', 'link-class-bar']);
			expect(entity).to.not.have.sirenLinksByClass(['foo', 'bar']);
			expect(function() {
				expect(entity).to.have.sirenLinksByClass(['link-class-foo', 'foo']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenLinksByClass(['link-class-foo', 'bar']);
			}).to.throw();
		});

		it('expect().to.have.sirenLinkByType()', function() {
			expect(entity).to.have.sirenLinkByType('link-type');
			expect(entity).to.have.sirenLinkByType('link-type').with.property('href', 'http://example.com');
			expect(entity).to.not.have.sirenLinkByType('foo');
			expect(function() {
				expect(entity).to.have.sirenLinkByType('foo');
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenLinkByType('link-type');
			}).to.throw();
		});

		it('expect().to.have.sirenLinksByType()', function() {
			expect(entity).to.have.sirenLinksByType(['link-type']);
			expect(entity).to.not.have.sirenLinksByType(['foo', 'bar']);
			expect(function() {
				expect(entity).to.have.sirenLinksByType(['link-type', 'foo']);
			}).to.throw();
			expect(function() {
				expect(entity).to.not.have.sirenLinksByType(['link-type', 'bar']);
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
