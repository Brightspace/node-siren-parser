import { expect, use } from 'chai';
import Action from '../src/Action.js';
import sirenChai from '../src/chaiPlugin.js';
import Entity from '../src/Entity.js';
import Field from '../src/Field.js';
import Link from '../src/Link.js';

use(sirenChai);

describe('Chai Plugin v2', function() {
	let
		action,
		entity,
		field,
		link,
		subEntity,
		subEntitySparse;

	beforeEach(function() {
		field = new Field({
			name: 'name',
			class: ['class1', 'class2'],
			type: 'text',
			value: 'value',
			title: 'title'
		});
		action = new Action({
			name: 'name',
			class: ['class1', 'class2'],
			method: 'GET',
			href: 'http://example.com',
			title: 'title',
			type: 'application/x-www-form-urlencoded',
			fields: [field]
		});
		link = new Link({
			rel: ['rel1', 'rel2'],
			class: ['class1', 'class2', 'link-class'],
			href: 'http://example.com',
			title: 'title',
			type: 'type'
		});
		subEntity = new Entity({
			rel: ['rel1', 'rel2'],
			class: ['class1', 'class2', 'subentity-class'],
			properties: {
				one: 1,
				two: 2
			},
			links: [link],
			actions: [action],
			title: 'title'
		});
		subEntitySparse = new Entity({
			rel: ['rel1', 'rel2'],
			class: ['class1']
		});

		entity = new Entity({
			class: ['class1', 'class2'],
			properties: {
				one: 1,
				two: 2
			},
			entities: [subEntity, subEntitySparse, link],
			links: [link],
			actions: [action],
			title: 'title'
		});
	});

	it('.classes(c1, c2, ...)', function() {
		expect(entity).to.have.classes('class1');
		expect(entity).to.not.have.classes('foo');
		expect(() => {
			expect(entity).to.have.classes('foo');
		}).to.throw();
		expect(() => {
			expect(entity).to.not.have.classes('class1');
		}).to.throw();

		expect(entity.entities).to.have.classes('class1');
		expect(entity.entities).to.not.have.classes('foo');
		expect(() => {
			expect(entity.entities).to.have.classes('foo');
		}).to.throw();
		expect(() => {
			expect(entity.entities).to.not.have.classes('class1');
		}).to.throw();

		expect(entity.entities).to.all.have.classes('class1');
		expect(entity.entities).to.all.not.have.classes('foo');
		expect(() => {
			expect(entity.entities).to.all.have.classes('foo');
		}).to.throw();
		expect(() => {
			expect(entity.entities).to.all.not.have.classes('class1');
		}).to.throw();

		expect(entity.entities).to.have.classes('class1', 'link-class', 'subentity-class');
		expect(() => {
			// Throws because nothing has field-class
			expect(entity.entities).to.have.classes('class1', 'link-class', 'field-class');
		});
		expect(() => {
			// Throws because class1 is present
			expect(entity.entities).to.not.have.classes('class1', 'link-class', 'foo');
		}).to.throw();
		expect(() => {
			// Throws because sub-entity doesn't have link-class
			expect(entity.entities).to.all.have.classes('class1', 'link-class');
		}).to.throw();
	});

	it('.rels(r1, r2, ...)', function() {
		// Uses same code as .classes(), so don't really need to test extensively
		expect(entity).to.not.have.rels('rel1');
		expect(subEntity).to.have.rels('rel1');
		expect(link).to.have.rels('rel1');
		// Invalid types
		expect(() => {
			expect(action).to.have.rels('rel1');
		}).to.throw();
		expect(() => {
			expect(field).to.have.rels('rel1');
		}).to.throw();
	});

	it('.title(desiredTitle)', function() {
		expect(entity).to.have.title('title');
		expect(entity).to.not.have.title('foo');
		expect(() => {
			expect(entity).to.have.title('foo');
		}).to.throw();
		expect(() => {
			expect(entity).to.not.have.title('title');
		}).to.throw();

		expect(entity.entities).to.have.title('title');
		expect(entity.entities).to.not.have.title('foo');
		expect(() => {
			expect(entity.entities).to.have.title('foo');
		}).to.throw();
		expect(() => {
			expect(entity.entities).to.not.have.title('title');
		}).to.throw();

		expect([entity, subEntity, link]).to.all.have.title('title');
		expect(entity.entities).to.not.all.have.title('foo');
		expect(() => {
			expect(entity.entities).to.all.have.title('foo');
		}).to.throw();
		expect(() => {
			expect(entity.entities).to.not.all.have.title('title');
		}).to.throw();
	});

	it('.href(desiredHref)', function() {
		expect(action).to.have.href('http://example.com');
		expect(link).to.have.href('http://example.com');
		expect(() => {
			expect(entity).to.have.href('http://example.com');
		}).to.throw();
		expect(() => {
			expect(field).to.have.href('http://example.com');
		}).to.throw();
	});

	it('.name(desiredName)', function() {
		expect(action).to.have.name('name');
		expect(field).to.have.name('name');
		expect(() => {
			expect(entity).to.have.name('name');
		}).to.throw();
		expect(() => {
			expect(link).to.have.name('name');
		}).to.throw();
	});

	it('.method(desiredMethod)', function() {
		expect(action).to.have.method('GET');
		expect(() => {
			expect(entity).to.have.method('GET');
		}).to.throw();
		expect(() => {
			expect(field).to.have.method('GET');
		}).to.throw();
		expect(() => {
			expect(link).to.have.method('GET');
		}).to.throw();
	});

	it('.type(desiredType)', function() {
		expect(action).to.have.type('application/x-www-form-urlencoded');
		expect(field).to.have.type('text');
		expect(link).to.have.type('type');
		expect(() => {
			expect(entity).to.have.type('type');
		}).to.throw();
	});

	it('.value(desiredValue)', function() {
		expect(field).to.have.value('value');
		expect(() => {
			expect(action).to.have.value('value');
		}).to.throw();
		expect(() => {
			expect(entity).to.have.value('value');
		}).to.throw();
		expect(() => {
			expect(link).to.have.value('value');
		}).to.throw();
	});

	it('.sirenActions', function() {
		expect(entity).to.have.sirenAction;
		expect(entity).to.have.sirenActions;
		expect(subEntitySparse).to.not.have.sirenActions;
		expect(() => {
			expect(entity).to.not.have.sirenActions;
		}).to.throw();
		expect(() => {
			expect(subEntitySparse).to.have.sirenActions;
		}).to.throw();
	});

	it('.sirenEntities', function() {
		expect(entity).to.have.sirenEntity;
		expect(entity).to.have.sirenEntities;
	});

	it('.sirenFields', function() {
		expect(action).to.have.sirenField;
		expect(action).to.have.sirenFields;
		expect(() => {
			expect(entity).to.have.sirenFields;
		}).to.throw();
	});

	it('.sirenLinks', function() {
		expect(entity).to.have.sirenLink;
		expect(entity).to.have.sirenLinks;
	});

	it('.sirenProperties', function() {
		expect(entity).to.have.sirenProperty;
		expect(entity).to.have.sirenProperties;
		expect(subEntitySparse).to.not.have.sirenProperties;
		expect(() => {
			expect(entity).to.not.have.sirenProperties;
		}).to.throw();
		expect(() => {
			expect(subEntitySparse).to.have.sirenProperties;
		}).to.throw();
	});
});
