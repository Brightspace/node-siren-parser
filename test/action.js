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

		it('should be able to use field helper methods', function() {
			resource.fields = [{
				class: ['abc'],
				name: 'foo',
				title: 'bar'
			}];
			siren = buildAction();
			expect(siren.fields[0].hasClass('abc')).to.be.true;
		});
	});

	describe('toJSON', function() {
		function toJSON() {
			return JSON.stringify(buildAction());
		}

		it('should stringify name and href', function() {
			expect(toJSON()).to.equal(
				'{"name":"foo","href":"bar","method":"GET","type":"application/x-www-form-urlencoded"}'
			);
		});

		it('should stringify class', function() {
			resource.class = ['abc'];
			expect(toJSON()).to.equal(
				'{"name":"foo","href":"bar","class":["abc"],"method":"GET","type":"application/x-www-form-urlencoded"}'
			);
		});

		it('should stringify fields', function() {
			resource.fields = [{
				name: 'foo',
				title: 'bar'
			}];
			expect(toJSON()).to.equal(
				'{"name":"foo","href":"bar","method":"GET","type":"application/x-www-form-urlencoded","fields":[{"name":"foo","title":"bar"}]}'
			);
		});
	});

	describe('Helper functions', function() {
		describe('has...', function() {
			describe('Class', function() {
				it('should be able to determine if an action has a given class', function() {
					resource.class = ['foo'];
					siren = buildAction();
					expect(siren.hasClass('foo')).to.be.true;

					expect(siren.hasClass(/foo/)).to.be.true;
					expect(siren.hasClass(/bar/)).to.be.false;

					resource.class = undefined;
					siren = buildAction();
					expect(siren.hasClass('foo')).to.be.false;
				});
			});

			describe('Field', function() {
				it('hasFieldByName (hasField)', function() {
					resource.fields = [{
						name: 'foo'
					}];
					siren = buildAction();
					expect(siren.hasField('foo')).to.be.true;

					expect(siren.hasField(/foo/)).to.be.true;
					expect(siren.hasField(/bar/)).to.be.false;

					resource.fields = undefined;
					siren = buildAction();
					expect(siren.hasField('foo')).to.be.false;
				});

				it('hasFieldByClass', function() {
					resource.fields = [{
						name: 'foo',
						class: ['bar']
					}];
					siren = buildAction();
					expect(siren.hasFieldByClass('bar')).to.be.true;

					expect(siren.hasFieldByClass(/bar/)).to.be.true;
					expect(siren.hasFieldByClass(/foo/)).to.be.false;

					resource.fields = undefined;
					siren = buildAction();
					expect(siren.hasFieldByClass('bar')).to.be.false;
				});

				it('hasFieldByType', function() {
					resource.fields = [{
						name: 'foo',
						type: 'text'
					}];
					siren = buildAction();
					expect(siren.hasFieldByType('text')).to.be.true;

					expect(siren.hasFieldByType(/text/)).to.be.true;
					expect(siren.hasFieldByType(/nope/)).to.be.false;

					resource.fields = undefined;
					siren = buildAction();
					expect(siren.hasFieldByType('text')).to.be.false;
				});
			});
		});

		describe('get...', function() {
			describe('Field', function() {
				beforeEach(function() {
					resource.fields = [{
						name: 'foo',
						title: 'bar',
						class: ['baz'],
						type: 'text'
					}, {
						name: 'foo2',
						title: 'bar2',
						class: ['baz'],
						type: 'text'
					}];
					siren = buildAction();
				});

				it('getFieldByName (getField)', function() {
					expect(siren.getField('foo')).to.have.property('title', 'bar');
					expect(siren.getField('nope')).to.be.undefined;

					expect(siren.getField(/foo/)).to.not.be.undefined;
					expect(siren.getField(/bar/)).to.be.undefined;
				});

				it('getFieldByClass', function() {
					expect(siren.getFieldByClass('baz')).to.have.property('title', 'bar');
					expect(siren.getFieldByClass('nope')).to.be.undefined;

					expect(siren.getFieldByClass(/baz/)).to.not.be.undefined;
					expect(siren.getFieldByClass(/foo/)).to.be.undefined;
				});

				it('getFieldsByClass', function() {
					expect(siren.getFieldsByClass('baz')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getFieldsByClass('nope')).to.be.an.instanceof(Array).and.to.be.empty;

					expect(siren.getFieldsByClass(/baz/)).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getFieldsByClass(/foo/)).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getFieldByType', function() {
					expect(siren.getFieldByType('text')).to.have.property('title', 'bar');
					expect(siren.getFieldByType('nope')).to.be.undefined;

					expect(siren.getFieldByType(/text/)).to.have.property('title', 'bar');
					expect(siren.getFieldByType(/nope/)).to.be.undefined;
				});

				it('getFieldsByType', function() {
					expect(siren.getFieldsByType('text')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getFieldsByType('nope')).to.be.an.instanceof(Array).and.to.be.empty;

					expect(siren.getFieldsByType(/text/)).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getFieldsByType(/nope/)).to.be.an.instanceof(Array).and.to.be.empty;
				});
			});
		});
	});
});
