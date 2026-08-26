import { expect, use } from 'chai';
import { parse, perform } from '../src/superagent.js';
import Action from '../src/Action.js';
import Entity from '../src/index.js';
import nock from 'nock';
import request from 'supertest';
import sinonChai from 'sinon-chai';
import sirenChai from '../src/chaiPlugin.js';

use(sinonChai);
use(sirenChai);

describe('Siren Superagent Plugin', () => {
	let app, src;

	beforeEach(() => {
		app = undefined;
		src = 'http://localhost';
	});

	afterEach(() => {
		if (app) {
			expect(app.isDone()).to.be.true;
		}
	});

	describe('parser', () => {
		it('should parse a json body', done => {
			app = nock(src)
				.get('/')
				.reply(200, {});

			request(src)
				.get('/')
				.parse(parse)
				.expect(200)
				.expect((res) => {
					expect(res.body).to.be.an.instanceof(Entity);
				})
				.end(done);
		});

		// Emits a "double callback!" warning due to https://github.com/visionmedia/superagent/issues/633
		it('should throw an error when parsing fails', done => {
			app = nock(src)
				.get('/')
				.reply(200, 'not json');

			request(src)
				.get('/')
				.parse(parse)
				.end((err, res) => {
					expect(err).to.be.an.instanceof(SyntaxError);
					expect(res).to.be.undefined;
					done();
				});
		});

		it('should parse a string as a siren entity', () => {
			const entity = parse('{}');
			expect(entity).to.be.an.instanceof(Entity);
		});
	});

	describe('perform action', () => {
		let resource;
		function buildAction() {
			return new Action(resource);
		}

		beforeEach(() => {
			resource = {
				name: 'foo',
				href: '/'
			};
		});

		it('should perform a basic action', done => {
			app = nock(src)
				.get('/')
				.reply(200);

			const action = buildAction();
			perform(request(src), action)
				.expect(200)
				.end(done);
		});

		function testMethodWithQuery(method) {
			it(`should perform a ${method} action with fields`, done => {
				app = nock(src)[method.toLowerCase()]('/')
					.query({ query: 'parameter' })
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
			it(`should perform a ${method} action with fields`, done => {
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

		it('should add list of fields on performed action', done => {
			app = nock(src)
				.get('/')
				.query({ query: 'parameter' })
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

		it('should add fields on performed action', done => {
			app = nock(src)
				.get('/')
				.query({ query: 'parameter' })
				.reply(200);

			const action = buildAction();
			perform(request(src), action)
				.submit({ query: 'parameter' })
				.expect(200)
				.end(done);
		});

		it('should add fields string on performed action', done => {
			app = nock(src)
				.get('/')
				.query({ query: 'parameter' })
				.reply(200);

			const action = buildAction();
			perform(request(src), action)
				.submit('query=parameter')
				.expect(200)
				.end(done);
		});
	});
});
