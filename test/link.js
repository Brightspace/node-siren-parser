import { expect, use } from 'chai';
import Link from '../src/Link.js';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

use(sinonChai);

describe('Link', () => {
	let
		resource,
		sandbox,
		siren;

	beforeEach(() => {
		resource = {
			rel: [],
			href: 'foo'
		};
		siren = undefined;
		sandbox = sinon.createSandbox();
		sandbox.stub(console, 'error');
		sandbox.stub(console, 'warn');
	});

	afterEach(() => {
		sandbox.restore();
	});

	function buildLink() {
		return new Link(resource);
	}

	it('should auto-instantiate', () => {
		expect(Link(resource)).to.be.an.instanceof(Link);
	});

	it('should require the link be an object', () => {
		resource = 1;
		expect(buildLink.bind()).to.throw('link must be an object, got 1');
	});

	describe('rel', () => {
		it('should require a rel', () => {
			resource.rel = undefined;
			expect(buildLink.bind()).to.throw('link.rel must be an array, got undefined');
		});

		it('should require rel be an array', () => {
			resource.rel = 1;
			expect(buildLink.bind()).to.throw('link.rel must be an array, got 1');
		});

		it('should parse rel', () => {
			siren = buildLink();
			expect(siren.rel).to.be.an.instanceof(Array);
		});
	});

	describe('href', () => {
		it('should require a href', () => {
			resource.href = undefined;
			expect(buildLink.bind()).to.throw('link.href must be a string, got undefined');
		});

		it('should require href be a string', () => {
			resource.href = 1;
			expect(buildLink.bind()).to.throw('link.href must be a string, got 1');
		});

		it('should parse href', () => {
			siren = buildLink();
			expect(siren.href).to.equal('foo');
		});
	});

	describe('class', () => {
		it('should parse class', () => {
			resource.class = [];
			siren = buildLink();
			expect(siren.class).to.be.an.instanceof(Array);
		});

		it('should require class be an array, if supplied', () => {
			resource.class = 1;
			expect(buildLink.bind()).to.throw('link.class must be an array or undefined, got 1');
		});

		it('should be able to determine if a link has a given class', () => {
			resource.class = ['foo'];
			siren = buildLink();
			expect(siren.hasClass('foo')).to.be.true;

			expect(siren.hasClass(/foo/)).to.be.true;
			expect(siren.hasClass(/bar/)).to.be.false;

			resource.class = undefined;
			siren = buildLink();
			expect(siren.hasClass('foo')).to.be.false;
		});
	});

	describe('title', () => {
		it('should parse title', () => {
			resource.title = 'baz';
			siren = buildLink();
			expect(siren.title).to.equal('baz');
		});

		it('should require title be a string, if supplied', () => {
			resource.title = 1;
			expect(buildLink.bind(undefined, resource)).to.throw('link.title must be a string or undefined, got 1');
		});
	});

	describe('type', () => {
		it('should parse type', () => {
			resource.type = 'baz';
			siren = buildLink();
			expect(siren.type).to.equal('baz');
		});

		it('should require type be a string, if supplied', () => {
			resource.type = 1;
			expect(buildLink.bind(undefined, resource)).to.throw('link.type must be a string or undefined, got 1');
		});
	});

	describe('toJSON', () => {
		function toJSON() {
			return JSON.stringify(buildLink());
		}

		it('should stringify rel and href', () => {
			expect(toJSON()).to.equal(
				'{"rel":[],"href":"foo"}'
			);
		});

		it('should stringify class', () => {
			resource.class = ['abc'];
			expect(toJSON()).to.equal(
				'{"rel":[],"href":"foo","class":["abc"]}'
			);
		});

		it('should stringify title', () => {
			resource.title = 'bar';
			expect(toJSON()).to.equal(
				'{"rel":[],"href":"foo","title":"bar"}'
			);
		});

		it('should stringify type', () => {
			resource.type = 'text/html';
			expect(toJSON()).to.equal(
				'{"rel":[],"href":"foo","type":"text/html"}'
			);
		});
	});
});
