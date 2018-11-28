import Action from '../src/Action';
import Entity from '../src/index';
import {expect, use} from 'chai';
import sirenChai from '../src/chaiPlugin';
import {parse, perform} from '../src/superagent';
import sinonChai from 'sinon-chai';

const
	nock = require('nock'),
	request = require('supertest');

use(sinonChai);
use(sirenChai);

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
				.parse(parse)
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
				.parse(parse)
				.end(function(err, res) {
					expect(err).to.be.an.instanceof(SyntaxError);
					expect(res).to.be.undefined;
					done();
				});
		});

		it('should parse a string as a siren entity', function() {
			const entity = parse('{}');
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
			perform(request(src), action)
				.expect(200)
				.end(done);
		});

		function testMethodWithQuery(method) {
			it('should perform a ' + method + ' action with fields', function(done) {
				app = nock(src)[method.toLowerCase()]('/')
					.query({query: 'parameter'})
					.reply(200);

				resource.method = method;
				resource.fields = [
					{
						name: 'query',
						value: 'parameter'
					}
				];
				const action = buildAction();
				perform(request(src), action)
					.expect(200)
					.end(done);
			});
		}

		function testMethodWithBody(method) {
			it('should perform a ' + method + ' action with fields', function(done) {
				app = nock(src)[method.toLowerCase()]('/', 'query=parameter')
					.reply(200);

				resource.method = method;
				resource.fields = [
					{
						name: 'query',
						value: 'parameter'
					}
				];
				const action = buildAction();
				perform(request(src), action)
					.expect(200)
					.end(done);
			});
		}

		testMethodWithQuery('GET');
		testMethodWithQuery('HEAD');
		testMethodWithBody('POST');
		testMethodWithBody('PUT');
		testMethodWithBody('PATCH');
		testMethodWithBody('DELETE');

		it('should add list of fields on performed action', function(done) {
			app = nock(src)
				.get('/')
				.query({query: 'parameter'})
				.reply(200);

			const action = buildAction();
			perform(request(src), action)
				.submit([
					{
						name: 'query',
						value: 'parameter'
					}
				])
				.expect(200)
				.end(done);
		});

		it('should add fields on performed action', function(done) {
			app = nock(src)
				.get('/')
				.query({query: 'parameter'})
				.reply(200);

			const action = buildAction();
			perform(request(src), action)
				.submit({query: 'parameter'})
				.expect(200)
				.end(done);
		});

		it('should add fields string on performed action', function(done) {
			app = nock(src)
				.get('/')
				.query({query: 'parameter'})
				.reply(200);

			const action = buildAction();
			perform(request(src), action)
				.submit('query=parameter')
				.expect(200)
				.end(done);
		});
	});
});
