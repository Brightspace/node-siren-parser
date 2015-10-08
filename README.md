# node-siren-parser

[![Build Status](https://magnum.travis-ci.com/Brightspace/node-siren-parser.svg?token=Cab9cPiYKusHs1TWpuUv&branch=master)](https://magnum.travis-ci.com/Brightspace/node-siren-parser) [![Coverage Status](https://coveralls.io/repos/Brightspace/node-siren-parser/badge.svg?branch=master&service=github&t=smOGqn)](https://coveralls.io/github/Brightspace/node-siren-parser?branch=master)

Parses a Siren object (or Siren JSON string) into an Entity object that is intended to be easier to work with and test, and prevent having to parse replies from Siren APIs manually. Fully implements the [Siren spec](siren), including all restrictions and requirements on entities, links, fields, etc. Kinda complements [node-siren-writer](node-siren-writer), in that they're inteded to sort of be opposites. Also includes a plugin for use with [chai](chai).

## Usage

```js
const sirenParser = require('@d2l/siren-parser');
const sirenParserChai = require('@d2l/siren-parser').chai;
const sirenJson = {
	title: 'My title',
	class: ['outer'],
	links: [{
		rel: ['self', 'crazy'],
		href: 'http://example.com'
	}],
	actions: [{
		name: 'fancy-action',
		href: 'http://example.com',
		title: 'A fancy action!',
		method: 'GET',
		fields: [{
			name: 'max',
			title: 'Maximum value'
		}]
	}],
	entities: [{
		class: ['inner', 'smaller'],
		rel: ['child'],
		links: [{
			rel: ['self'],
			href: 'http://example.com/child',
			title: 'Child entity'
		}]
	}],
	properties: {
		one: 1,
		two: 2,
		pi: 'is exactly three'
	}
}
};

const resource = sirenParser(sirenJson);

// ... assuming you've got all your chai stuff set up
expect(resource).to.have.sirenAction('fancy-action');
```

## API

### `sirenParser(String|Object siren)`

Returns an [Entity](#entity) object with all Siren attributes specified. Input can be a Siren object or a Siren JSON string.

---

### `Entity`

Attributes:

* `rel` (array of strings) _Required if Entity is a sub-entity_
* `title` (string)
* `type` (string)
* `properties` (object)
* `class` (array of strings)
* `actions` (array of [Actions](#action))
* `links` (array of [Links](#link))
* `entities` (array of Entities)

Each of these can be accessed as `Entity.attribute`, e.g. if one of the input's `properties` is`foo`, it would be accessed as `Entity.properties.foo`.

> Note that only those attributes present in the input will be copied into the `Entity`, i.e. if your input has no links, `Entity.links` will not be set, rather than being an empty array.

#### `Entity.hasClass(String class)`

Returns true if the Entity has the specified `class`, otherwise false.

```js
resource.hasClass('foo'); // false
```

#### `Entity.hasProperty(String property)`

Returns true if the Entity has the specified `property`, otherwise false.

```js
resource.hasProperty('pi'); // true
```

#### `Entity.getAction(String name)`

Returns the [Action](#action) with the specified `name` if it exists, otherwise `undefined`. Actions are indexed by `name` upon parse, so this is O(1).

```js
resource.getAction('fancy-action'); // The 'fancy-action' Action instance
resource.getAction('fancy-action').title; // 'A fancy action!'
```

#### `Entity.getLink(String rel)`

Returns the [Link](#link) with the specified `rel` if it exists, otherwise `undefined`. Links are indexed by `rel` upon parse, so this is O(1).

```js
resource.getLink('self'); // The 'self' Link instance
resource.getLink('crazy'); // The same Link instance as above
resource.getLink('self').rel; // ['self', 'crazy']
```

#### `Entity.getSubEntity(String rel)`

Returns the sub-Entity with the specified `rel` if it exists, otherwise `undefined`. Sub-entities are indexed by `rel` upon parse, so this is O(1).

```js
// Whoo chaining!
resource.getSubEntity('child').getLink('self').title; // 'Child entity'
```

#### `Entity.getSubEntitiesByClass(String class)`

Returns an array containing all sub-entities with the given `class`, otherwise `undefined`. Sub-entities are indexed by `rel` upon parse, so this is O(1).

```js
resource.getSubEntitiesByClass('inner'); // [ Entity/Entities with 'inner' class ]
```

---

### `Link`

Attributes:

* `rel` (array of strings) _Required_
* `href` (string) _Required_
* `class` (array of strings)
* `title` (string)
* `type` (string) _If specified, must be an HTML5 input type - see [this link][action types]_

#### `Link.hasClass(String class)`

Returns true if the Link has the specified `class`, otherwise false.

```js
resource.hasClass('foo'); // false
```

---

### `Action`

Attributes:

* `name` (string) _Required_
* `href` (string) _Required_
* `class` (array of strings)
* `method` (string)
* `title` (string)
* `type` (string)
* `fields` (array of [Fields](#field))

#### `Action.hasClass(String class)`

Returns true if the Action has the specified `class`, otherwise false.

```js
resource.hasClass('foo'); // false
```

#### `Action.hasField(String name)`

Returns true if Action has a field with the name `name`, otherwise false.

```js
resource.getAction('fancy-action').hasField('max'); // true
```

#### `Action.getField(String name)`

Returns the [Field](#field) with the specified `name` if it exists, otherwise `undefined`. Fields are indexed by `name` upon parse, so this is O(1).

```js
resource.getAction('fancy-action').getField('max'); // The 'max' Field instance
resource.getAction('fancy-action').getField('max').title; // 'Maximum value'
```

---

### `Field`

Attributes:

* `name` (string) _Required_
* `value` (string)
* `class` (array of strings)
* `type` (string)
* `title` (string)

#### `Field.hasClass(String class)`

Returns true if the Field has the specified `class`, otherwise false.

```js
resource.hasClass('foo'); // false
```

## `chai` interface

There are a few helper `chai` methods included with this module, under `./chaiPlugin`. These are mostly equivalents of the `hasX` methods in the API (and take generally the same arguments), to make testing with `chai` cleaner. Can also test whether a given resource is a particular Siren type.

```js
// Without chai plugin, boo ugly!
expect(resource.hasClass('foo')).to.be.true;
// With chai plugin magic!
expect(resource).to.have.sirenClass('foo');

// Importing a bunch of classes? Gross!
const Entity = require('./src/Entity');
expect(resource).to.be.an.instanceof(Entity);
// 50% fewer lines of code = 2000% better tests, guaranteed!
expect(resource).to.be.a.siren('entity');
```

The available assertions are:

* `expect(resource).to.have.sirenAction('foo')`
* `expect(resource).to.have.sirenAction('foo').with.property('href', 'foo')`
* `expect(resource).to.have.sirenActions(['foo', 'bar'])`
* `expect(resource).to.have.sirenClass('foo')`
* `expect(resource).to.have.sirenClasses(['foo', 'bar', 'baz'])`
* `expect(resource).to.have.sirenEntity('foo')`
* `expect(resource).to.have.sirenEntity('foo').with.property('title', 'foo')`
* `expect(resource).to.have.sirenEntities(['foo', 'bar', 'baz'])`
* `expect(resource).to.have.sirenField('foo')`
* `expect(resource).to.have.sirenField('foo').with.property('name', 'foo')`
* `expect(resource).to.have.sirenFields(['foo', 'bar', 'baz'])`
* `expect(resource).to.have.sirenLink('foo')`
* `expect(resource).to.have.sirenLink('foo').with.property('href', 'foo')`
* `expect(resource).to.have.sirenLinks(['foo', 'bar', 'baz'])`
* `expect(resource).to.have.sirenProperty('foo')`
* `expect(resource).to.have.sirenProperty('foo').that.equals('bar')`
* `expect(resource).to.have.sirenProperties(['foo', 'bar', 'baz'])`
* `expect(resource).to.be.a.siren('entity')` - checks if `resource` is a Siren entity. Other types include action, class, field, and link.

## Testing

```js
npm test
```

## Contributing

1. **Fork** the repository. Committing directly against this repository is highly discouraged.

2. Make your modifications in a branch, updating and writing new tests as necessary in the `test` directory.

3. Ensure that all tests pass with `npm test`

4. `rebase` your changes against master. *Do not merge*.

5. Submit a pull request to this repository. Wait for tests to run and someone to chime in.

## Code Style

This repository is configured with [EditorConfig][EditorConfig], [jscs][jscs]
and [JSHint][JSHint] rules. See the [docs.dev code style article][code style]
for information on installing editor extensions.

[node-siren-writer]: https://github.com/dominicbarnes/node-siren-writer
[chai]: https://github.com/chaijs/chai
[siren]: https://github.com/kevinswiber/siren
[action types]: https://github.com/kevinswiber/siren#type-3
[EditorConfig]: http://editorconfig.org/
[jscs]: http://jscs.info/
[JSHint]: http://jshint.com/
[code style]: http://docs.dev.d2l/index.php/JavaScript_Code_Style_(Personal_Learning)
