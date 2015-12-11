/* global describe, it, beforeEach, afterEach */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon');

const Action = require('../src/Action');

chai.use(require('sinon-chai'));

describe('Action', function() {
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

		it('should default to GET', function() {
			siren = buildAction();
			expect(siren.method).to.equal('GET');
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

		it('should default to application/x-www-form-urlencoded', function() {
			siren = buildAction();
			expect(siren.type).to.equal('application/x-www-form-urlencoded');
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
	});
});
