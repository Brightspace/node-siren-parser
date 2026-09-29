import { expect, use } from 'chai';
import Action from '../src/Action.js';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

use(sinonChai);

describe('Action', () => {
	let
		resource,
		sandbox,
		siren;

	beforeEach(() => {
		resource = {
			name: 'foo',
			href: 'bar'
		};
		siren = undefined;
		sandbox = sinon.createSandbox();
		sandbox.stub(console, 'error');
		sandbox.stub(console, 'warn');
	});

	afterEach(() => {
		sandbox.restore();
	});

	function buildAction() {
		return new Action(resource);
	}

	it('should auto-instantiate', () => {
		expect(Action(resource)).to.be.an.instanceof(Action);
	});

	it('should require the action be an object', () => {
		resource = 1;
		expect(buildAction.bind()).to.throw('action must be an object, got 1');
	});

	describe('name', () => {
		it('should require a name', () => {
			resource.name = undefined;
			expect(buildAction.bind()).to.throw('action.name must be a string, got undefined');
		});

		it('should require name be a string', () => {
			resource.name = 1;
			expect(buildAction.bind()).to.throw('action.name must be a string, got 1');
		});

		it('should parse name', () => {
			siren = buildAction();
			expect(siren.name).to.equal('foo');
		});
	});

	describe('href', () => {
		it('should require a href', () => {
			resource.href = undefined;
			expect(buildAction.bind()).to.throw('action.href must be a string, got undefined');
		});

		it('should require href be a string', () => {
			resource.href = 1;
			expect(buildAction.bind()).to.throw('action.href must be a string, got 1');
		});

		it('should parse href', () => {
			siren = buildAction();
			expect(siren.href).to.equal('bar');
		});
	});

	describe('class', () => {
		it('should parse class', () => {
			resource.class = [];
			siren = buildAction();
			expect(siren.class).to.be.an.instanceof(Array);
		});

		it('should require class be an array, if supplied', () => {
			resource.class = 1;
			expect(buildAction.bind()).to.throw('action.class must be an array or undefined, got 1');
		});
	});

	describe('method', () => {
		it('should parse method', () => {
			resource.method = 'baz';
			siren = buildAction();
			expect(siren.method).to.equal('baz');
		});

		it('should default to GET', () => {
			siren = buildAction();
			expect(siren.method).to.equal('GET');
		});

		it('should require method be a string, if supplied', () => {
			resource.method = 1;
			expect(buildAction.bind(undefined, resource)).to.throw('action.method must be a string or undefined, got 1');
		});
	});

	describe('title', () => {
		it('should parse title', () => {
			resource.title = 'baz';
			siren = buildAction();
			expect(siren.title).to.equal('baz');
		});

		it('should require title be a string, if supplied', () => {
			resource.title = 1;
			expect(buildAction.bind(undefined, resource)).to.throw('action.title must be a string or undefined, got 1');
		});
	});

	describe('type', () => {
		it('should parse type', () => {
			resource.type = 'baz';
			siren = buildAction();
			expect(siren.type).to.equal('baz');
		});

		it('should default to application/x-www-form-urlencoded', () => {
			siren = buildAction();
			expect(siren.type).to.equal('application/x-www-form-urlencoded');
		});

		it('should require type be a string, if supplied', () => {
			resource.type = 1;
			expect(buildAction.bind(undefined, resource)).to.throw('action.type must be a string or undefined, got 1');
		});
	});

	describe('fields', () => {
		it('should parse fields', () => {
			resource.fields = [];
			siren = buildAction();
			expect(siren.fields).to.be.an.instanceof(Array);
		});

		it('should require fields be an array, if supplied', () => {
			resource.fields = 1;
			expect(buildAction.bind(undefined, resource)).to.throw('action.fields must be an array or undefined, got 1');
		});

		it('should be able to determine if an Action has a given Field', () => {
			resource.fields = [{
				name: 'foo'
			}];
			siren = buildAction();
			expect(siren.hasField('foo')).to.be.true;
		});

		it('should be able to retrieve fields based off their name', () => {
			resource.fields = [{
				name: 'foo',
				title: 'bar'
			}];
			siren = buildAction();
			expect(siren.getField('foo')).to.have.property('title', 'bar');
		});

		it('should be able to use field helper methods', () => {
			resource.fields = [{
				class: ['abc'],
				name: 'foo',
				title: 'bar'
			}];
			siren = buildAction();
			expect(siren.fields[0].hasClass('abc')).to.be.true;
		});
	});

	describe('toJSON', () => {
		function toJSON() {
			return JSON.stringify(buildAction());
		}

		it('should stringify name and href', () => {
			expect(toJSON()).to.equal(
				'{"name":"foo","href":"bar","method":"GET","type":"application/x-www-form-urlencoded"}'
			);
		});

		it('should stringify class', () => {
			resource.class = ['abc'];
			expect(toJSON()).to.equal(
				'{"name":"foo","href":"bar","class":["abc"],"method":"GET","type":"application/x-www-form-urlencoded"}'
			);
		});

		it('should stringify fields', () => {
			resource.fields = [{
				name: 'foo',
				title: 'bar'
			}];
			expect(toJSON()).to.equal(
				'{"name":"foo","href":"bar","method":"GET","type":"application/x-www-form-urlencoded","fields":[{"name":"foo","title":"bar"}]}'
			);
		});
	});

	describe('Helper functions', () => {
		describe('has...', () => {
			describe('Class', () => {
				it('should be able to determine if an action has a given class', () => {
					resource.class = ['foo'];
					siren = buildAction();
					expect(siren.hasClass('foo')).to.be.true;
					expect(siren.hasClass(undefined)).to.be.false;
					expect(siren.hasClass('')).to.be.false;
					expect(siren.hasClass(null)).to.be.false;

					expect(siren.hasClass(/foo/)).to.be.true;
					expect(siren.hasClass(/bar/)).to.be.false;

					resource.class = undefined;
					siren = buildAction();
					expect(siren.hasClass('foo')).to.be.false;
				});
			});

			describe('Field', () => {
				it('hasFieldByName (hasField)', () => {
					resource.fields = [{
						name: 'foo'
					}];
					siren = buildAction();
					expect(siren.hasField('foo')).to.be.true;
					expect(siren.hasField(undefined)).to.be.false;
					expect(siren.hasField('')).to.be.false;
					expect(siren.hasField(null)).to.be.false;

					expect(siren.hasField(/foo/)).to.be.true;
					expect(siren.hasField(/bar/)).to.be.false;

					resource.fields = undefined;
					siren = buildAction();
					expect(siren.hasField('foo')).to.be.false;
				});

				it('hasFieldByClass', () => {
					resource.fields = [{
						name: 'foo',
						class: ['bar']
					}];
					siren = buildAction();
					expect(siren.hasFieldByClass('bar')).to.be.true;
					expect(siren.hasFieldByClass(undefined)).to.be.false;
					expect(siren.hasFieldByClass('')).to.be.false;
					expect(siren.hasFieldByClass(null)).to.be.false;

					expect(siren.hasFieldByClass(/bar/)).to.be.true;
					expect(siren.hasFieldByClass(/foo/)).to.be.false;

					resource.fields = undefined;
					siren = buildAction();
					expect(siren.hasFieldByClass('bar')).to.be.false;
				});

				it('hasFieldByType', () => {
					resource.fields = [{
						name: 'foo',
						type: 'text'
					}];
					siren = buildAction();
					expect(siren.hasFieldByType('text')).to.be.true;
					expect(siren.hasFieldByType(undefined)).to.be.false;
					expect(siren.hasFieldByType('')).to.be.false;
					expect(siren.hasFieldByType(null)).to.be.false;

					expect(siren.hasFieldByType(/text/)).to.be.true;
					expect(siren.hasFieldByType(/nope/)).to.be.false;

					resource.fields = undefined;
					siren = buildAction();
					expect(siren.hasFieldByType('text')).to.be.false;
				});
			});
		});

		describe('get...', () => {
			describe('Field', () => {
				beforeEach(() => {
					resource.fields = [{
						name: 'foo',
						title: 'bar',
						class: ['baz', 'bonk'],
						type: 'text'
					}, {
						name: 'foo2',
						title: 'bar2',
						class: ['baz', 'bork'],
						type: 'text'
					}, {
						name: 'foo3',
						title: 'bar3',
						class: ['bonk', 'bork'],
						type: 'url'
					}, {
						name: 'foo4',
						title: 'bar4',
						class: ['bonk', 'bork'],
						type: 'url'
					}];
					siren = buildAction();
				});

				it('getFieldByName (getField)', () => {
					expect(siren.getField('foo')).to.have.property('title', 'bar');
					expect(siren.getField('nope')).to.be.undefined;
					expect(siren.getField(undefined)).to.be.undefined;
					expect(siren.getField('')).to.be.undefined;
					expect(siren.getField(null)).to.be.undefined;

					expect(siren.getField(/foo/)).to.not.be.undefined;
					expect(siren.getField(/bar/)).to.be.undefined;
				});

				it('getFieldByClass', () => {
					expect(siren.getFieldByClass('baz')).to.have.property('title', 'bar');
					expect(siren.getFieldByClass('nope')).to.be.undefined;
					expect(siren.getFieldByClass(undefined)).to.be.undefined;
					expect(siren.getFieldByClass('')).to.be.undefined;
					expect(siren.getFieldByClass(null)).to.be.undefined;

					expect(siren.getFieldByClass(/baz/)).to.not.be.undefined;
					expect(siren.getFieldByClass(/foo/)).to.be.undefined;
				});

				it('getFieldsByClass', () => {
					expect(siren.getFieldsByClass('baz')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getFieldsByClass('nope')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getFieldsByClass(undefined)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getFieldsByClass('')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getFieldsByClass(null)).to.be.an.instanceof(Array).and.to.be.empty;

					expect(siren.getFieldsByClass(/baz/)).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getFieldsByClass(/foo/)).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getFieldByClasses', () => {
					expect(siren.getFieldByClasses(['bonk', 'bork'])).to.have.property('name', 'foo3');
					expect(siren.getFieldByClasses([/bonk/, /bork/])).to.have.property('name', 'foo3');
					expect(siren.getFieldByClasses(['bonk', /bork/])).to.have.property('name', 'foo3');
					expect(siren.getFieldByClasses(['bonk', 'nope'])).to.be.undefined;
					expect(siren.getFieldByClasses([/bonk/, /nope/])).to.be.undefined;
					expect(siren.getFieldByClasses(['bonk', /nope/])).to.be.undefined;
					expect(siren.getFieldByClasses([undefined])).to.be.undefined;
					expect(siren.getFieldByClasses([''])).to.be.undefined;
					expect(siren.getFieldByClasses([null])).to.be.undefined;
				});

				it('getFieldsByClasses', () => {
					expect(siren.getFieldsByClasses(['bonk', 'bork'])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getFieldsByClasses([/bonk/, /bork/])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getFieldsByClasses(['bonk', /bork/])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getFieldsByClasses(['bonk', 'nope'])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getFieldsByClasses([/bonk/, /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getFieldsByClasses(['bonk', /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getFieldsByClasses([undefined])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getFieldsByClasses([''])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getFieldsByClasses([null])).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getFieldByType', () => {
					expect(siren.getFieldByType('text')).to.have.property('title', 'bar');
					expect(siren.getFieldByType('nope')).to.be.undefined;
					expect(siren.getFieldByType(undefined)).to.be.undefined;
					expect(siren.getFieldByType('')).to.be.undefined;
					expect(siren.getFieldByType(null)).to.be.undefined;

					expect(siren.getFieldByType(/text/)).to.have.property('title', 'bar');
					expect(siren.getFieldByType(/nope/)).to.be.undefined;
				});

				it('getFieldsByType', () => {
					expect(siren.getFieldsByType('text')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getFieldsByType('nope')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getFieldsByType(undefined)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getFieldsByType('')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getFieldsByType(null)).to.be.an.instanceof(Array).and.to.be.empty;

					expect(siren.getFieldsByType(/text/)).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getFieldsByType(/nope/)).to.be.an.instanceof(Array).and.to.be.empty;
				});
			});
		});
	});
});
