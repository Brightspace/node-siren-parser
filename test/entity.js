import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Action from '../src/Action.js';
import Entity from '../src/Entity.js';
import Link from '../src/Link.js';
import SirenParse from '../src/index.js';

use(sinonChai);

describe('Entity', function() {
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

	function buildEntity() {
		return SirenParse(resource);
	}

	it('should auto-instantiate', function() {
		expect(SirenParse(resource)).to.be.an.instanceof(Entity);
	});

	it('should work with stringified entity', function() {
		resource = '{}';
		expect(buildEntity()).to.be.an('object');
	});

	it('should return an empty entity if nothing is passed', function() {
		resource = undefined;
		expect(buildEntity()).to.be.an('object');
	});

	describe('title', function() {
		it('should parse title', function() {
			resource.title = 'A title!';
			siren = buildEntity();
			expect(siren.title).to.equal('A title!');
		});

		it('should require title be a string, if supplied', function() {
			resource.title = 1;
			expect(buildEntity.bind()).to.throw('entity.title must be a string or undefined, got 1');
		});
	});

	describe('type', function() {
		it('should parse type', function() {
			resource.type = 'foo';
			siren = buildEntity();
			expect(siren.type).to.equal('foo');
		});

		it('should require type be a string, if supplied', function() {
			resource.type = 1;
			expect(buildEntity.bind()).to.throw('entity.type must be a string or undefined, got 1');
		});
	});

	describe('properties', function() {
		it('should parse properties', function() {
			resource.properties = {};
			siren = buildEntity();
			expect(siren.properties).to.be.an('object');
		});

		it('should require properties be an object, if supplied', function() {
			resource.properties = 1;
			expect(buildEntity.bind()).to.throw('entity.properties must be an object or undefined, got 1');
		});

		it('should be able to determine if an entity has a given property', function() {
			resource.properties = {
				foo: 'bar'
			};
			siren = buildEntity();
			expect(siren.hasProperty('foo')).to.be.true;
		});
	});

	describe('class', function() {
		it('should parse class', function() {
			resource.class = [];
			siren = buildEntity();
			expect(siren.class).to.be.an.instanceof(Array);
		});

		it('should require class be an array, if supplied', function() {
			resource.class = 1;
			expect(buildEntity.bind()).to.throw('entity.class must be an array or undefined, got 1');
		});
	});

	describe('actions', function() {
		it('should parse actions', function() {
			resource.actions = [],
			siren = buildEntity();
			expect(siren.actions).to.be.an.instanceof(Array);
		});

		it('should require actions be an array, if supplied', function() {
			resource.actions = 1;
			expect(buildEntity.bind()).to.throw('entity.actions must be an array or undefined, got 1');
		});
	});

	describe('links', function() {
		it('should parse links', function() {
			resource.links = [],
			siren = buildEntity();
			expect(siren.links).to.be.an.instanceof(Array);
		});

		it('should require links be an array, if supplied', function() {
			resource.links = 1;
			expect(buildEntity.bind()).to.throw('entity.links must be an array or undefined, got 1');
		});
	});

	describe('(sub)entities', function() {
		it('should parse (sub)entities', function() {
			resource.entities = [];
			siren = buildEntity();
			expect(siren.entities).to.be.an.instanceof(Array);
		});

		it('should require (sub)entities be an array, if supplied', function() {
			resource.entities = 1;
			expect(buildEntity.bind()).to.throw('entity.entities must be an array or undefined, got 1');
		});

		it('should require (sub)entities have a rel', function() {
			resource.entities = [{
				foo: 'bar'
			}];
			expect(buildEntity.bind()).to.throw('sub-entities must have a rel array, got undefined');
		});

		it('should work with chained Entity/Action/Links', function() {
			resource.entities = [{
				rel: ['foo'],
				actions: [{
					name: 'bar',
					href: 'baz'
				}]
			}];
			siren = buildEntity();
			expect(siren.getSubEntityByRel('foo').getActionByName('bar'))
				.to.be.an.instanceof(Action)
				.with.property('href', 'baz');
		});

		it('should correctly identify entity sub-entities', function() {
			resource.entities = [{
				rel: ['foo'],
				title: 'bar'
			}];
			siren = buildEntity();
			expect(siren.getSubEntityByRel('foo')).to.be.an.instanceof(Entity);
		});

		it('should correctly identify link sub-entities', function() {
			resource.entities = [{
				rel: ['foo'],
				href: 'bar'
			}];
			siren = buildEntity();
			expect(siren.getSubEntityByRel('foo')).to.be.an.instanceof(Link);
		});

		it('should not duplicate sub-entities with the same rel', function() {
			resource.entities = [{
				rel: ['foo', 'bar']
			}];
			siren = buildEntity();
			expect(siren.getSubEntityByRel('foo')).to.equal(siren.getSubEntityByRel('bar'));
		});
	});

	describe('toJSON', function() {
		function toJSON() {
			return JSON.stringify(buildEntity());
		}

		it('should stringify (empty)', function() {
			expect(toJSON()).to.equal(
				'{}'
			);
		});

		it('should stringify title', function() {
			resource.title = 'A title!';
			expect(toJSON()).to.equal(
				'{"title":"A title!"}'
			);
		});

		it('should stringify type', function() {
			resource.type = 'foo';
			expect(toJSON()).to.equal(
				'{"type":"foo"}'
			);
		});

		it('should stringify properties', function() {
			resource.properties = {};
			expect(toJSON()).to.equal(
				'{"properties":{}}'
			);
		});

		it('should stringify class', function() {
			resource.class = [];
			expect(toJSON()).to.equal(
				'{"class":[]}'
			);
		});

		it('should stringify actions', function() {
			resource.actions = [],
			expect(toJSON()).to.equal(
				'{"actions":[]}'
			);
		});

		it('should stringify links', function() {
			resource.links = [],
			expect(toJSON()).to.equal(
				'{"links":[]}'
			);
		});

		it('should stringify entities', function() {
			resource.entities = [];
			expect(toJSON()).to.equal(
				'{"entities":[]}'
			);
		});

		it('should stringify sub entities', function() {
			resource.entities = [{
				rel: ['foo'],
				actions: [{
					name: 'bar',
					href: 'baz'
				}]
			}];
			expect(toJSON()).to.equal(
				'{"entities":[{"rel":["foo"],"actions":[{"name":"bar","href":"baz","method":"GET","type":"application/x-www-form-urlencoded"}]}]}'
			);
		});
	});

	describe('helper functions', function() {
		describe('has...', function() {
			describe('Action', function() {
				it('hasActionByName', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar'
					}];
					siren = buildEntity();
					expect(siren.hasActionByName('foo')).to.be.true;
					expect(siren.hasActionByName(undefined)).to.be.false;
					expect(siren.hasActionByName('')).to.be.false;
					expect(siren.hasActionByName(null)).to.be.false;

					expect(siren.hasActionByName(/foo/)).to.be.true;
					expect(siren.hasActionByName(/bar/)).to.be.false;

					resource.actions = undefined;
					siren = buildEntity();
					expect(siren.hasActionByName('foo')).to.be.false;
				});

				it('hasActionByClass', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						class: ['baz']
					}];
					siren = buildEntity();
					expect(siren.hasActionByClass('baz')).to.be.true;
					expect(siren.hasActionByClass(undefined)).to.be.false;
					expect(siren.hasActionByClass('')).to.be.false;
					expect(siren.hasActionByClass(null)).to.be.false;

					expect(siren.hasActionByClass(/baz/)).to.be.true;
					expect(siren.hasActionByClass(/foo/)).to.be.false;

					resource.actions = undefined;
					siren = buildEntity();
					expect(siren.hasActionByClass('baz')).to.be.false;
				});

				it('hasActionByMethod', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						method: 'GET'
					}];
					siren = buildEntity();
					expect(siren.hasActionByMethod('GET')).to.be.true;
					expect(siren.hasActionByMethod(undefined)).to.be.false;
					expect(siren.hasActionByMethod('')).to.be.false;
					expect(siren.hasActionByMethod(null)).to.be.false;

					expect(siren.hasActionByMethod(/GET/)).to.be.true;
					expect(siren.hasActionByMethod(/PUT/)).to.be.false;

					resource.actions = undefined;
					siren = buildEntity();
					expect(siren.hasActionByMethod('GET')).to.be.false;
				});

				it('hasActionByType', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						type: 'application/x-www-form-urlencoded'
					}];
					siren = buildEntity();
					expect(siren.hasActionByType('application/x-www-form-urlencoded')).to.be.true;
					expect(siren.hasActionByType(undefined)).to.be.false;
					expect(siren.hasActionByType('')).to.be.false;
					expect(siren.hasActionByType(null)).to.be.false;

					expect(siren.hasActionByType(/urlencoded/)).to.be.true;
					expect(siren.hasActionByType(/foo/)).to.be.false;

					resource.actions = undefined;
					siren = buildEntity();
					expect(siren.hasActionByType('application/x-www-form-urlencoded')).to.be.false;
				});
			});

			describe('Class', function() {
				it('hasClass', function() {
					resource.class = ['foo'];
					siren = buildEntity();
					expect(siren.hasClass('foo')).to.be.true;
					expect(siren.hasClass(undefined)).to.be.false;
					expect(siren.hasClass('')).to.be.false;
					expect(siren.hasClass(null)).to.be.false;

					expect(siren.hasClass(/foo/)).to.be.true;
					expect(siren.hasClass(/bar/)).to.be.false;

					resource.class = undefined;
					siren = buildEntity();
					expect(siren.hasClass('foo')).to.be.false;
				});
			});

			describe('Entity', function() {
				it('hasSubEntityByRel', function() {
					resource.entities = [{
						rel: ['foo']
					}];
					siren = buildEntity();
					expect(siren.hasSubEntityByRel('foo')).to.be.true;

					expect(siren.hasSubEntityByRel(/bar/)).to.be.false;
					expect(siren.hasSubEntityByRel(/foo/)).to.be.true;
					expect(siren.hasSubEntityByRel(/bar/)).to.be.false;
					expect(siren.hasSubEntityByRel(/foo/)).to.be.true;

					expect(siren.hasSubEntityByRel(undefined)).to.be.false;
					expect(siren.hasSubEntityByRel('')).to.be.false;
					expect(siren.hasSubEntityByRel(null)).to.be.false;

					resource.entities = undefined;
					siren = buildEntity();
					expect(siren.hasSubEntityByRel('foo')).to.be.false;
				});

				it('hasSubEntityByClass', function() {
					resource.entities = [{
						rel: ['foo'],
						class: ['bar']
					}];
					siren = buildEntity();
					expect(siren.hasSubEntityByClass('bar')).to.be.true;

					expect(siren.hasSubEntityByClass(/bar/)).to.be.true;
					expect(siren.hasSubEntityByClass(/baz/)).to.be.false;

					expect(siren.hasSubEntityByClass(undefined)).to.be.false;
					expect(siren.hasSubEntityByClass('')).to.be.false;
					expect(siren.hasSubEntityByClass(null)).to.be.false;

					resource.entities = undefined;
					siren = buildEntity();
					expect(siren.hasSubEntityByClass('bar')).to.be.false;
				});

				it('hasSubEntityByType', function() {
					resource.entities = [{
						rel: ['foo'],
						type: 'bar'
					}];
					siren = buildEntity();
					expect(siren.hasSubEntityByType('bar')).to.be.true;

					expect(siren.hasSubEntityByType(/bar/)).to.be.true;
					expect(siren.hasSubEntityByType(/baz/)).to.be.false;

					expect(siren.hasSubEntityByType(undefined)).to.be.false;
					expect(siren.hasSubEntityByType('')).to.be.false;
					expect(siren.hasSubEntityByType(null)).to.be.false;

					resource.entities = undefined;
					siren = buildEntity();
					expect(siren.hasSubEntityByType('bar')).to.be.false;
				});
			});

			describe('Link', function() {
				it('hasLinkByRel', function() {
					resource.links = [{
						rel: ['foo'],
						href: 'bar'
					}];
					siren = buildEntity();
					expect(siren.hasLinkByRel('foo')).to.be.true;
					expect(siren.hasLinkByRel(undefined)).to.be.false;
					expect(siren.hasLinkByRel('')).to.be.false;
					expect(siren.hasLinkByRel(null)).to.be.false;

					expect(siren.hasLinkByRel(/foo/)).to.be.true;
					expect(siren.hasLinkByRel(/bar/)).to.be.false;

					resource.links = undefined;
					siren = buildEntity();
					expect(siren.hasLinkByRel('foo')).to.be.false;
				});

				it('hasLinkByClass', function() {
					resource.links = [{
						rel: ['foo'],
						href: 'bar',
						class: ['baz']
					}];
					siren = buildEntity();
					expect(siren.hasLinkByClass('baz')).to.be.true;
					expect(siren.hasLinkByClass(undefined)).to.be.false;
					expect(siren.hasLinkByClass('')).to.be.false;
					expect(siren.hasLinkByClass(null)).to.be.false;

					expect(siren.hasLinkByClass(/baz/)).to.be.true;
					expect(siren.hasLinkByClass(/foo/)).to.be.false;

					resource.links = undefined;
					siren = buildEntity();
					expect(siren.hasLinkByClass('baz')).to.be.false;
				});

				it('hasLinkByType', function() {
					resource.links = [{
						rel: ['foo'],
						href: 'bar',
						type: 'baz'
					}];
					siren = buildEntity();
					expect(siren.hasLinkByType('baz')).to.be.true;
					expect(siren.hasLinkByType(undefined)).to.be.false;
					expect(siren.hasLinkByType('')).to.be.false;
					expect(siren.hasLinkByType(null)).to.be.false;

					expect(siren.hasLinkByType(/baz/)).to.be.true;
					expect(siren.hasLinkByType(/foo/)).to.be.false;

					resource.links = undefined;
					siren = buildEntity();
					expect(siren.hasLinkByType('baz')).to.be.false;
				});
			});

			describe('Property', function() {
				it('hasProperty', function() {
					resource.properties = { foo: 'bar' };
					siren = buildEntity();
					expect(siren.hasProperty('foo')).to.be.true;
					expect(siren.hasProperty(undefined)).to.be.false;
					expect(siren.hasProperty('')).to.be.false;
					expect(siren.hasProperty(null)).to.be.false;

					expect(siren.hasProperty(/foo/)).to.be.true;
					expect(siren.hasProperty(/bar/)).to.be.false;

					resource.properties = undefined;
					siren = buildEntity();
					expect(siren.hasProperty('foo')).to.be.false;
				});
			});
		});

		describe('get...', function() {
			describe('Action', function() {
				it('getActionByName', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar'
					}];
					siren = buildEntity();
					expect(siren.getActionByName('foo')).to.have.property('href', 'bar');
					expect(siren.getActionByName(/foo/)).to.have.property('href', 'bar');
					expect(siren.getActionByName(undefined)).to.be.undefined;
					expect(siren.getActionByName('')).to.be.undefined;
					expect(siren.getActionByName(null)).to.be.undefined;
				});

				it('getActionByClass', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						class: ['baz']
					}];
					siren = buildEntity();
					expect(siren.getActionByClass('baz')).to.have.property('href', 'bar');
					expect(siren.getActionByClass(/baz/)).to.have.property('href', 'bar');
					expect(siren.getActionByClass('foo')).to.be.undefined;
					expect(siren.getActionByClass(/foo/)).to.be.undefined;
					expect(siren.getActionByClass(undefined)).to.be.undefined;
					expect(siren.getActionByClass('')).to.be.undefined;
					expect(siren.getActionByClass(null)).to.be.undefined;
				});

				it('getActionsByClass', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						class: ['baz']
					}, {
						name: 'foo2',
						href: 'bar2',
						class: ['baz']
					}];
					siren = buildEntity();
					expect(siren.getActionsByClass('baz')).to.have.lengthOf(2);
					expect(siren.getActionsByClass(/baz/)).to.have.lengthOf(2);
					expect(siren.getActionsByClass('foo')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByClass(/foo/)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByClass(undefined)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByClass('')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByClass(null)).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getActionByClasses', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						class: ['baz', 'bonk']
					}, {
						name: 'foo2',
						href: 'bar2',
						class: ['baz', 'bork']
					}, {
						name: 'foo3',
						href: 'bar3',
						class: ['bork', 'bonk']
					}, {
						name: 'foo4',
						href: 'bar4',
						class: ['bork', 'bonk']
					}];
					siren = buildEntity();
					expect(siren.getActionByClasses(['bonk', 'bork'])).to.have.property('href', 'bar3');
					expect(siren.getActionByClasses([/bonk/, /bork/])).to.have.property('href', 'bar3');
					expect(siren.getActionByClasses(['bonk', /bork/])).to.have.property('href', 'bar3');
					expect(siren.getActionByClasses(['bonk', 'nope'])).to.be.undefined;
					expect(siren.getActionByClasses([/bonk/, /nope/])).to.be.undefined;
					expect(siren.getActionByClasses(['bonk', /nope/])).to.be.undefined;
					expect(siren.getActionByClasses([undefined])).to.be.undefined;
					expect(siren.getActionByClasses([''])).to.be.undefined;
					expect(siren.getActionByClasses([null])).to.be.undefined;
				});

				it('getActionsByClasses', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						class: ['baz', 'bonk']
					}, {
						name: 'foo2',
						href: 'bar2',
						class: ['baz', 'bork']
					}, {
						name: 'foo3',
						href: 'bar3',
						class: ['bork', 'bonk']
					}, {
						name: 'foo4',
						href: 'bar4',
						class: ['bork', 'bonk']
					}];
					siren = buildEntity();
					expect(siren.getActionsByClasses(['bonk', 'bork'])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getActionsByClasses([/bonk/, /bork/])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getActionsByClasses(['bonk', /bork/])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getActionsByClasses(['bonk', 'nope'])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByClasses([/bonk/, /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByClasses(['bonk', /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByClasses([undefined])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByClasses([''])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByClasses([null])).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getActionByMethod', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						method: 'GET'
					}];
					siren = buildEntity();
					expect(siren.getActionByMethod('GET')).to.have.property('href', 'bar');
					expect(siren.getActionByMethod(/GET/)).to.have.property('href', 'bar');
					expect(siren.getActionByMethod('PUT')).to.be.undefined;
					expect(siren.getActionByMethod(/PUT/)).to.be.undefined;
					expect(siren.getActionByMethod(undefined)).to.be.undefined;
					expect(siren.getActionByMethod('')).to.be.undefined;
					expect(siren.getActionByMethod(null)).to.be.undefined;
				});

				it('getActionsByMethod', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						method: 'GET'
					}, {
						name: 'foo2',
						href: 'bar2',
						method: 'GET'
					}];
					siren = buildEntity();
					expect(siren.getActionsByMethod('GET')).to.have.lengthOf(2);
					expect(siren.getActionsByMethod(/GET/)).to.have.lengthOf(2);
					expect(siren.getActionsByMethod('PUT')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByMethod(/PUT/)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByMethod(undefined)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByMethod('')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByMethod(null)).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getActionByType', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						type: 'application/x-www-form-urlencoded'
					}];
					siren = buildEntity();
					expect(siren.getActionByType('application/x-www-form-urlencoded')).to.have.property('href', 'bar');
					expect(siren.getActionByType(/urlencoded/)).to.have.property('href', 'bar');
					expect(siren.getActionByType('foo')).to.be.undefined;
					expect(siren.getActionByType(/foo/)).to.be.undefined;
					expect(siren.getActionByType(undefined)).to.be.undefined;
					expect(siren.getActionByType('')).to.be.undefined;
					expect(siren.getActionByType(null)).to.be.undefined;
				});

				it('getActionsByType', function() {
					resource.actions = [{
						name: 'foo',
						href: 'bar',
						type: 'application/x-www-form-urlencoded'
					}, {
						name: 'foo2',
						href: 'bar2',
						type: 'application/x-www-form-urlencoded'
					}];
					siren = buildEntity();
					expect(siren.getActionsByType('application/x-www-form-urlencoded')).to.have.lengthOf(2);
					expect(siren.getActionsByType(/urlencoded/)).to.have.lengthOf(2);
					expect(siren.getActionsByType('foo')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByType(/foo/)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByType(undefined)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByType('')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getActionsByType(null)).to.be.an.instanceof(Array).and.to.be.empty;
				});
			});

			describe('Link', function() {
				beforeEach(function() {
					resource.links = [{
						rel: ['foo'],
						href: 'bar',
						class: ['baz', 'bonk'],
						type: 'quux'
					}, {
						rel: ['foo', 'foo2'],
						href: 'bar2',
						class: ['baz', 'bork'],
						type: 'quux'
					}, {
						rel: ['foo3'],
						href: 'bar3',
						class: ['bork', 'bonk'],
						type: 'xxuq'
					}, {
						rel: ['foo4'],
						href: 'bar4',
						class: ['bork', 'bonk'],
						type: 'xxuq'
					}, {
						rel: ['foo5'],
						href: 'bar5'
					}];
					siren = buildEntity();
				});

				it('getLinkByRel', function() {
					expect(siren.getLinkByRel('foo')).to.have.property('href', 'bar');
					expect(siren.getLinkByRel(/foo/)).to.have.property('href', 'bar');
					expect(siren.getLinkByRel('nope')).to.be.undefined;
					expect(siren.getLinkByRel(/nope/)).to.be.undefined;
					expect(siren.getLinkByRel(undefined)).to.be.undefined;
					expect(siren.getLinkByRel('')).to.be.undefined;
					expect(siren.getLinkByRel(null)).to.be.undefined;
				});

				it('getLinksByRel', function() {
					expect(siren.getLinksByRel('foo')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinksByRel(/foo/)).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinksByRel('nope')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByRel(/nope/)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByRel(undefined)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByRel('')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByRel(null)).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getLinkByRels', function() {
					expect(siren.getLinkByRels(['foo', 'foo2'])).to.have.property('href', 'bar2');
					expect(siren.getLinkByRels([/foo/, /foo2/])).to.have.property('href', 'bar2');
					expect(siren.getLinkByRels(['foo', /foo2/])).to.have.property('href', 'bar2');
					expect(siren.getLinkByRels(['foo', 'nope'])).to.be.undefined;
					expect(siren.getLinkByRels([/foo/, /nope/])).to.be.undefined;
					expect(siren.getLinkByRels(['foo', /nope/])).to.be.undefined;
					expect(siren.getLinkByRels([undefined])).to.be.undefined;
					expect(siren.getLinkByRels([''])).to.be.undefined;
					expect(siren.getLinkByRels([null])).to.be.undefined;
				});

				it('getLinksByRels', function() {
					expect(siren.getLinksByRels(['foo', 'foo2'])).to.be.an.instanceof(Array).with.lengthOf(1);
					expect(siren.getLinksByRels([/foo/, /foo2/])).to.be.an.instanceof(Array).with.lengthOf(1);
					expect(siren.getLinksByRels(['foo', /foo2/])).to.be.an.instanceof(Array).with.lengthOf(1);
					expect(siren.getLinksByRels(['foo', 'nope'])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByRels([/foo/, /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByRels(['foo', /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByRels([undefined])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByRels([''])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByRels([null])).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getLinkByClass', function() {
					expect(siren.getLinkByClass('baz')).to.have.property('href', 'bar');
					expect(siren.getLinkByClass(/baz/)).to.have.property('href', 'bar');
					expect(siren.getLinkByClass('nope')).to.be.undefined;
					expect(siren.getLinkByClass(/nope/)).to.be.undefined;
					expect(siren.getLinkByClass(undefined)).to.be.undefined;
					expect(siren.getLinkByClass('')).to.be.undefined;
					expect(siren.getLinkByClass(null)).to.be.undefined;
				});

				it('getLinksByClass', function() {
					expect(siren.getLinksByClass('baz')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinksByClass(/baz/)).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinksByClass('nope')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByClass(/nope/)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByClass(undefined)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByClass('')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByClass(null)).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getLinkByClasses', function() {
					expect(siren.getLinkByClasses(['bonk', 'bork'])).to.have.property('href', 'bar3');
					expect(siren.getLinkByClasses([/bonk/, /bork/])).to.have.property('href', 'bar3');
					expect(siren.getLinkByClasses(['bonk', /bork/])).to.have.property('href', 'bar3');
					expect(siren.getLinkByClasses(['bonk', 'nope'])).to.be.undefined;
					expect(siren.getLinkByClasses([/bonk/, /nope/])).to.be.undefined;
					expect(siren.getLinkByClasses(['bonk', /nope/])).to.be.undefined;
					expect(siren.getLinkByClasses([undefined])).to.be.undefined;
					expect(siren.getLinkByClasses([''])).to.be.undefined;
					expect(siren.getLinkByClasses([null])).to.be.undefined;
				});

				it('getLinksByClasses', function() {
					expect(siren.getLinksByClasses(['bonk', 'bork'])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinksByClasses([/bonk/, /bork/])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinksByClasses(['bonk', /bork/])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinksByClasses(['bonk', 'nope'])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByClasses([/bonk/, /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByClasses(['bonk', /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByClasses([undefined])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByClasses([''])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByClasses([null])).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getLinkByType', function() {
					expect(siren.getLinkByType('quux')).to.have.property('href', 'bar');
					expect(siren.getLinkByType(/quux/)).to.have.property('href', 'bar');
					expect(siren.getLinkByType('nope')).to.be.undefined;
					expect(siren.getLinkByType(/nope/)).to.be.undefined;
					expect(siren.getLinkByType(undefined)).to.be.undefined;
					expect(siren.getLinkByType('')).to.be.undefined;
					expect(siren.getLinkByType(null)).to.be.undefined;
				});

				it('getLinksByType', function() {
					expect(siren.getLinksByType('quux')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinksByType(/quux/)).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getLinksByType('nope')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByType(/nope/)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByType(undefined)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByType('')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getLinksByType(null)).to.be.an.instanceof(Array).and.to.be.empty;
				});
			});

			describe('Entity', function() {
				beforeEach(function() {
					resource.entities = [{
						rel: ['foo'],
						title: 'bar',
						class: ['baz', 'bonk'],
						type: 'quux'
					}, {
						rel: ['foo', 'foo2'],
						title: 'bar2',
						class: ['baz', 'bork'],
						type: 'quux'
					}, {
						rel: ['foo3'],
						title: 'bar3',
						class: ['bork', 'bonk'],
						type: 'xxuq'
					}, {
						rel: ['foo4'],
						title: 'bar4',
						class: ['bork', 'bonk'],
						type: 'xxuq'
					}];
					siren = buildEntity();
				});

				it('getSubEntityByRel', function() {
					expect(siren.getSubEntityByRel('foo')).to.have.property('title', 'bar');
					expect(siren.getSubEntityByRel(/foo/)).to.have.property('title', 'bar');
					expect(siren.getSubEntityByRel('nope')).to.be.undefined;
					expect(siren.getSubEntityByRel(/nope/)).to.be.undefined;
					expect(siren.getSubEntityByRel(undefined)).to.be.undefined;
					expect(siren.getSubEntityByRel('')).to.be.undefined;
					expect(siren.getSubEntityByRel(null)).to.be.undefined;
				});

				it('getSubEntitiesByRel', function() {
					expect(siren.getSubEntitiesByRel('foo')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntitiesByRel(/foo/)).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntitiesByRel('nope')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByRel(/nope/)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByRel(undefined)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByRel('')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByRel(null)).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getSubEntityByRels', function() {
					expect(siren.getSubEntityByRels(['foo', 'foo2'])).to.have.property('title', 'bar2');
					expect(siren.getSubEntityByRels([/foo/, /foo2/])).to.have.property('title', 'bar2');
					expect(siren.getSubEntityByRels(['foo', /foo2/])).to.have.property('title', 'bar2');
					expect(siren.getSubEntityByRels(['foo', 'nope'])).to.be.undefined;
					expect(siren.getSubEntityByRels([/foo/, /nope/])).to.be.undefined;
					expect(siren.getSubEntityByRels(['foo', /nope/])).to.be.undefined;
					expect(siren.getSubEntityByRels([undefined])).to.be.undefined;
					expect(siren.getSubEntityByRels([''])).to.be.undefined;
					expect(siren.getSubEntityByRels([null])).to.be.undefined;
				});

				it('getSubEntitiesByRels', function() {
					expect(siren.getSubEntitiesByRels(['foo', 'foo2'])).to.be.an.instanceof(Array).with.lengthOf(1);
					expect(siren.getSubEntitiesByRels([/foo/, /foo2/])).to.be.an.instanceof(Array).with.lengthOf(1);
					expect(siren.getSubEntitiesByRels(['foo', /foo2/])).to.be.an.instanceof(Array).with.lengthOf(1);
					expect(siren.getSubEntitiesByRels(['foo', 'nope'])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByRels([/foo/, /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByRels(['foo', /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByRels([undefined])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByRels([''])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByRels([null])).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getSubEntityByClass', function() {
					expect(siren.getSubEntityByClass('baz')).to.have.property('title', 'bar');
					expect(siren.getSubEntityByClass(/baz/)).to.have.property('title', 'bar');
					expect(siren.getSubEntityByClass('nope')).to.be.undefined;
					expect(siren.getSubEntityByClass(/nope/)).to.be.undefined;
					expect(siren.getSubEntityByClass(undefined)).to.be.undefined;
					expect(siren.getSubEntityByClass('')).to.be.undefined;
					expect(siren.getSubEntityByClass(null)).to.be.undefined;
				});

				it('getSubEntitiesByClass', function() {
					expect(siren.getSubEntitiesByClass('baz')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntitiesByClass(/baz/)).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntitiesByClass('nope')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByClass(/nope/)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByClass(undefined)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByClass('')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByClass(null)).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getSubEntityByClasses', function() {
					expect(siren.getSubEntityByClasses(['bonk', 'bork'])).to.have.property('title', 'bar3');
					expect(siren.getSubEntityByClasses([/bonk/, /bork/])).to.have.property('title', 'bar3');
					expect(siren.getSubEntityByClasses(['bonk', /bork/])).to.have.property('title', 'bar3');
					expect(siren.getSubEntityByClasses(['bonk', 'nope'])).to.be.undefined;
					expect(siren.getSubEntityByClasses([/bonk/, /nope/])).to.be.undefined;
					expect(siren.getSubEntityByClasses(['bonk', /nope/])).to.be.undefined;
					expect(siren.getSubEntityByClasses([undefined])).to.be.undefined;
					expect(siren.getSubEntityByClasses([''])).to.be.undefined;
					expect(siren.getSubEntityByClasses([null])).to.be.undefined;
				});

				it('getSubEntitiesByClasses', function() {
					expect(siren.getSubEntitiesByClasses(['bonk', 'bork'])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntitiesByClasses([/bonk/, /bork/])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntitiesByClasses(['bonk', /bork/])).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntitiesByClasses(['bonk', 'nope'])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByClasses([/bonk/, /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByClasses(['bonk', /nope/])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByClasses([undefined])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByClasses([''])).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByClasses([null])).to.be.an.instanceof(Array).and.to.be.empty;
				});

				it('getSubEntityByType', function() {
					expect(siren.getSubEntityByType('quux')).to.have.property('title', 'bar');
					expect(siren.getSubEntityByType(/quux/)).to.have.property('title', 'bar');
					expect(siren.getSubEntityByType('nope')).to.be.undefined;
					expect(siren.getSubEntityByType(/nope/)).to.be.undefined;
					expect(siren.getSubEntityByType(undefined)).to.be.undefined;
					expect(siren.getSubEntityByType('')).to.be.undefined;
					expect(siren.getSubEntityByType(null)).to.be.undefined;
				});

				it('getSubEntitiesByType', function() {
					expect(siren.getSubEntitiesByType('quux')).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntitiesByType(/quux/)).to.be.an.instanceof(Array).with.lengthOf(2);
					expect(siren.getSubEntitiesByType('nope')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByType(/nope/)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByType(undefined)).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByType('')).to.be.an.instanceof(Array).and.to.be.empty;
					expect(siren.getSubEntitiesByType(null)).to.be.an.instanceof(Array).and.to.be.empty;
				});
			});
		});
	});
});
