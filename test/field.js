import { expect, use } from 'chai';
import Field from '../src/Field';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

use(sinonChai);

describe('Field', function() {
	let
		resource,
		sandbox,
		siren;

	beforeEach(function() {
		resource = {};
		siren = undefined;
		sandbox = sinon.createSandbox();
		sandbox.stub(console, 'error');
		sandbox.stub(console, 'warn');
	});

	afterEach(function() {
		sandbox.restore();
	});

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
		expect(buildField.bind()).to.throw('field must be an object, got 1');
	});

	describe('name', function() {
		it('should require a name', function() {
			resource.name = undefined;
			expect(buildField.bind()).to.throw('field.name must be a string, got undefined');
		});

		it('should require name be a string', function() {
			resource.name = 1;
			expect(buildField.bind()).to.throw('field.name must be a string, got 1');
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
			expect(buildField.bind()).to.throw('field.class must be an array or undefined, got 1');
		});

		it('should be able to determine if a field has a given class', function() {
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

	describe('title', function() {
		it('should parse title', function() {
			resource.title = 'bar';
			siren = buildField();
			expect(siren.title).to.equal('bar');
		});

		it('should require title be a string, if supplied', function() {
			resource.title = 1;
			expect(buildField.bind(undefined, resource)).to.throw('field.title must be a string or undefined, got 1');
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
			expect(buildField.bind(undefined, resource)).to.throw('field.type must be a valid field type string or undefined, got 1');
		});

		it('should require type be a valid HTML5 input type, if specified', function() {
			resource.type = 'bar';
			expect(buildField.bind()).to.throw('field.type must be a valid field type string or undefined, got "bar"');
		});
	});

	describe('min', function() {
		it('should parse min', function() {
			resource.min = 1;
			siren = buildField();
			expect(siren.min).to.equal(1);
		});

		it('should require min be a number, if supplied', function() {
			resource.min = '1';
			expect(buildField.bind(undefined, resource)).to.throw('field.min must be a number or undefined, got "1"');
		});
	});

	describe('max', function() {
		it('should parse max', function() {
			resource.max = 9999;
			siren = buildField();
			expect(siren.max).to.equal(9999);
		});

		it('should require max be a number, if supplied', function() {
			resource.max = '9999';
			expect(buildField.bind(undefined, resource)).to.throw('field.max must be a number or undefined, got "9999"');
		});
	});

	describe('toJSON', function() {
		function toJSON() {
			return JSON.stringify(buildField());
		}

		it('should stringify name', function() {
			expect(toJSON()).to.equal(
				'{"name":"foo"}'
			);
		});

		it('should stringify value', function() {
			resource.value = 'bar';
			expect(toJSON()).to.equal(
				'{"name":"foo","value":"bar"}'
			);
		});

		it('should stringify class', function() {
			resource.class = ['abc'];
			expect(toJSON()).to.equal(
				'{"name":"foo","class":["abc"]}'
			);
		});

		it('should stringify title', function() {
			resource.title = 'bar';
			expect(toJSON()).to.equal(
				'{"name":"foo","title":"bar"}'
			);
		});

		it('should stringify type', function() {
			resource.type = 'text';
			expect(toJSON()).to.equal(
				'{"name":"foo","type":"text"}'
			);
		});

		it('should stringify min', function() {
			resource.min = 1;
			expect(toJSON()).to.equal(
				'{"name":"foo","min":1}'
			);
		});

		it('should stringify max', function() {
			resource.max = 9999;
			expect(toJSON()).to.equal(
				'{"name":"foo","max":9999}'
			);
		});
	});
});
