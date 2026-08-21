import { expect, use } from 'chai';
import Field from '../src/Field.js';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

use(sinonChai);

describe('Field', () => {
	let
		resource,
		sandbox,
		siren;

	beforeEach(() => {
		resource = {
			name: 'foo'
		};
		siren = undefined;
		sandbox = sinon.createSandbox();
		sandbox.stub(console, 'error');
		sandbox.stub(console, 'warn');
	});

	afterEach(() => {
		sandbox.restore();
	});

	function buildField() {
		return new Field(resource);
	}

	it('should auto-instantiate', () => {
		expect(Field(resource)).to.be.an.instanceof(Field);
	});

	it('should require the field be an object', () => {
		resource = 1;
		expect(buildField.bind()).to.throw('field must be an object, got 1');
	});

	describe('name', () => {
		it('should require a name', () => {
			resource.name = undefined;
			expect(buildField.bind()).to.throw('field.name must be a string, got undefined');
		});

		it('should require name be a string', () => {
			resource.name = 1;
			expect(buildField.bind()).to.throw('field.name must be a string, got 1');
		});

		it('should parse name', () => {
			siren = buildField();
			expect(siren.name).to.equal('foo');
		});
	});

	describe('value', () => {
		it('should parse value', () => {
			resource.value = 'foo';
			siren = buildField();
			expect(siren.value).to.equal('foo');
		});
	});

	describe('class', () => {
		it('should parse class', () => {
			resource.class = [];
			siren = buildField();
			expect(siren.class).to.be.an.instanceof(Array);
		});

		it('should require class be an array, if supplied', () => {
			resource.class = 1;
			expect(buildField.bind()).to.throw('field.class must be an array or undefined, got 1');
		});

		it('should be able to determine if a field has a given class', () => {
			resource.class = ['foo'];
			siren = buildField();
			expect(siren.hasClass('foo')).to.be.true;

			expect(siren.hasClass(/foo/)).to.be.true;
			expect(siren.hasClass(/bar/)).to.be.false;

			resource.class = undefined;
			siren = buildField();
			expect(siren.hasClass('foo')).to.be.false;
		});
	});

	describe('title', () => {
		it('should parse title', () => {
			resource.title = 'bar';
			siren = buildField();
			expect(siren.title).to.equal('bar');
		});

		it('should require title be a string, if supplied', () => {
			resource.title = 1;
			expect(buildField.bind(undefined, resource)).to.throw('field.title must be a string or undefined, got 1');
		});
	});

	describe('type', () => {
		it('should parse type', () => {
			resource.type = 'text';
			siren = buildField();
			expect(siren.type).to.equal('text');
		});

		it('should require type be a string, if supplied', () => {
			resource.type = 1;
			expect(buildField.bind(undefined, resource)).to.throw('field.type must be a valid field type string or undefined, got 1');
		});

		it('should require type be a valid HTML5 input type, if specified', () => {
			resource.type = 'bar';
			expect(buildField.bind()).to.throw('field.type must be a valid field type string or undefined, got "bar"');
		});
	});

	describe('min', () => {
		it('should parse min of 0', () => {
			resource.min = 0;
			siren = buildField();
			expect(siren.min).to.equal(0);
		});

		it('should parse min of 1', () => {
			resource.min = 1;
			siren = buildField();
			expect(siren.min).to.equal(1);
		});

		it ('should not have min if undefined', () => {
			resource.min = undefined;
			siren = buildField();
			expect(siren.min).to.be.undefined;
		});

		it('should require min be a number, if supplied', () => {
			resource.min = '1';
			expect(buildField.bind(undefined, resource)).to.throw('field.min must be a number or undefined, got "1"');
		});
	});

	describe('max', () => {
		it('should parse max of 0', () => {
			resource.max = 0;
			siren = buildField();
			expect(siren.max).to.equal(0);
		});

		it('should parse max of 9999', () => {
			resource.max = 9999;
			siren = buildField();
			expect(siren.max).to.equal(9999);
		});

		it ('should not have max if undefined', () => {
			resource.max = undefined;
			siren = buildField();
			expect(siren.max).to.be.undefined;
		});

		it('should require max be a number, if supplied', () => {
			resource.max = '9999';
			expect(buildField.bind(undefined, resource)).to.throw('field.max must be a number or undefined, got "9999"');
		});
	});

	describe('toJSON', () => {
		function toJSON() {
			return JSON.stringify(buildField());
		}

		it('should stringify name', () => {
			expect(toJSON()).to.equal(
				'{"name":"foo"}'
			);
		});

		it('should stringify value', () => {
			resource.value = 'bar';
			expect(toJSON()).to.equal(
				'{"name":"foo","value":"bar"}'
			);
		});

		it('should stringify class', () => {
			resource.class = ['abc'];
			expect(toJSON()).to.equal(
				'{"name":"foo","class":["abc"]}'
			);
		});

		it('should stringify title', () => {
			resource.title = 'bar';
			expect(toJSON()).to.equal(
				'{"name":"foo","title":"bar"}'
			);
		});

		it('should stringify type', () => {
			resource.type = 'text';
			expect(toJSON()).to.equal(
				'{"name":"foo","type":"text"}'
			);
		});

		it('should stringify min', () => {
			resource.min = 1;
			expect(toJSON()).to.equal(
				'{"name":"foo","min":1}'
			);
		});

		it('should stringify max', () => {
			resource.max = 9999;
			expect(toJSON()).to.equal(
				'{"name":"foo","max":9999}'
			);
		});
	});
});
