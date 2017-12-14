# node-siren-parser

[![Build Status](https://travis-ci.org/Brightspace/node-siren-parser.svg?branch=master)](https://travis-ci.org/Brightspace/node-siren-parser) [![Coverage Status](https://coveralls.io/repos/Brightspace/node-siren-parser/badge.svg?branch=master&service=github&t=smOGqn)](https://coveralls.io/github/Brightspace/node-siren-parser?branch=master)

Parses a Siren object (or Siren JSON string) into an Entity object that is intended to be easier to work with and test, and prevent having to parse replies from Siren APIs manually. Fully implements the [Siren spec](siren), including all restrictions and requirements on entities, links, fields, etc. Kinda complements [node-siren-writer](node-siren-writer), in that they're intended to sort of be opposites. Also includes a plugin for use with [chai](chai).

## Usage

There are two ways to use `node-siren-parser`'s functionality.

1. You can install it from npm using
   ```bash
   npm install siren-parser
   ```
   and then `require` it as you would any other npm package.

2. The parser is browserified and stored on the Brightspace CDN for client-side usage
   ```html
   <script src="https://s.brightspace.com/lib/siren-parser/{version}/siren-parser.js"></script>

   <script>
   var parsedEntity = window.D2L.Hypermedia.Siren.Parse('{"class":["foo","bar"]}');
   </script>
   ```
   An alternate bundle of the siren parser is available that is exposed as a property of the global object.
   ```html
   <script src="https://s.brightspace.com/lib/siren-parser/{version}/siren-parser-global.js"></script>
   ```
   The client-side code will still use the `window.D2L.Hypermedia.Siren` object, but this addresses the risk of collisions with other modules on the page that are exposed by browserify's standalone UMD bundle.

## API

```js
const sirenParser = require('siren-parser');
const sirenParserChai = require('siren-parser/chai');
const sirenSuperagent = require('siren-parser/superagent');
const sirenJson = {
	title: 'My title',
	class: ['outer'],
	links: [{
		rel: ['self', 'crazy'],
		href: 'http://example.com'
	}, {
		rel: ['crazy'],
		href: 'http://example2.com'
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
};

const resource = sirenParser(sirenJson);

// ... assuming you've got all your chai stuff set up
expect(resource).to.have.sirenAction('fancy-action');

const request = require('superagent');
sirenSuperagent.perform(request, resource.getAction('fancy-action'))
	.submit({key: 'value'}) // overrides default field(s) specified in action
	.parse(sirenSuperagent.parse)
	.end(function(err, res) {
		const resource = res.body; // parsed siren resource
		expect(resource).to.have.sirenProperty('some-field');
	});

// Alternatively, add the parser to the global superagent parser
request.parse['application/vnd.siren+json'] = sirenSuperagent.parse;
```

## API

### `sirenParser(String|Object siren)`

Returns an [Entity](#entity) object with all Siren attributes specified. Input can be a Siren object or a Siren JSON string.

---

### Helper functions

A set of helper functions are defined in the parser to help make working with the Siren resources easier. In general, each resource type has a set of `hasXByY` and `getXByY` functions, where X and Y are Siren resource types and Siren resource properties, respectively. There are some "shortcut" functions that are kept around for compatibility (e.g. `Entity.hasAction(name)`), but these are less explicit, so it is recommended to use the newer, more explicit functions (i.e. `Entity.hasActionByName(name)`).

These are contextually correct with respect to the Siren spec - as an example, there is no `Entity.getActionsByName` (only `Entity.getActionByName`, singular), as Action names must be unique on an Entity, meaning only one would ever be returned anyway.

It is also important to note that any "singular" functions (e.g. `Entity.getActionByName`, as opposed to `Entity.getActionsByName`) just returns the first matching resource, with no guarantees of order. This is useful in situations where you know there is only one matching resource, but do be careful with its use.

See each resource section for a full list of helper functions for that resource type.

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

#### `Entity.hasXByY(String|RegExp key)`

Returns true if the Entity has an _X_ with a _Y_ of `key` (or which matches `RegExp key`), otherwise false.

* `hasActionByName(name)`
* `hasActionByClass(class)`
* `hasClass(class)`
* `hasSubEntityByRel(rel)`
* `hasSubEntityByClass(class)`
* `hasSubEntityByType(type)`
* `hasLinkByRel(rel)`
* `hasLinkByClass(class)`
* `hasLinkByType(type)`
* `hasProperty(prop)`

```js
resource.hasActionByName('fancy-action'); // true
resource.hasClass('inner'); // false
resource.hasSubEntityByRel('child'); // true
resource.hasSubEntityByType('child'); // false
resource.hasLinkByRel('crazy'); // true
resource.hasProperty('three'); // false
```

#### `Entity.getXByY(String|RegExp key)`

Returns the resource(s) of type _X_ with a _Y_ value of `key` (or which matches `RegExp key`). If the requested _X_ is singular, then the result is either the matching instance of _X_, or undefined. If the requested _X_ is plural, then the result is either an Array of the matching instances of _X_, or an empty Array.

* `getActionByName(name)` - returns [Action](#action) or undefined
* `getActionByClass(class)` - returns [Action](#action) or undefined
* `getLinkByRel(rel)` - returns [Link](#link) or undefined
* `getLinkByClass(class)` - returns [Link](#link) or undefined
* `getLinkByType(type)` - returns [Link](#link) or undefined
* `getSubEntityByRel(rel)` (`getSubEntity(rel)`) - returns [Entity](#entity) or undefined
* `getSubEntityByClass(class)` - returns [Entity](#entity) or undefined
* `getSubEntityByType(type)` - returns [Entity](#entity) or undefined
* `getActionsByClass(class)` - returns Array of [Actions](#action) (empty Array if none match)
* `getLinksByRel(rel)` - returns Array of [Links](#link) (empty Array if none match)
* `getLinksByClass(class)` - returns Array of [Links](#link) (empty Array if none match)
* `getLinksByType(type)` - returns Array of [Links](#link) (empty Array if none match)
* `getSubEntitiesByRel(rel)` - returns Array of [Entities](#entity) (empty Array if none match)
* `getSubEntitiesByClass(class)` - returns Array of [Entities](#entity) (empty Array if none match)
* `getSubEntitiesByType(type)` - returns Array of [Entities](#entity) (empty Array if none match)

```js
resource.getActionByName('fancy-action'); // The 'fancy-action' Action instance
resource.getActionByName('fancy-action').title; // 'A fancy action!'
resource.getLinkByRel('self'); // The 'self' Link instance
resource.getLinkByRel('crazy'); // The same Link instance as above
resource.getLinkByRel('self').rel; // ['self', 'crazy']
resource.getLinksByRel('crazy'); // Array containing two Links
resource.getSubEntitiesByRel('child'); // Array of two entities
resource.getSubEntityByRel('child'); // Single entity
resource.getSubEntityByRel('child').getLink('self').title; // 'Child entity'
resource.getSubEntityByClass('inner'); // Entity with 'inner' class
resource.getSubEntitiesByClass('inner'); // [ All Entities with 'inner' class ]
```

#### `Entity.getXByY'es(Array[String|RegExp key])`
Returns the resource(s) of type _X_ with matching _Y_ values of multiple `key` (or which matches `RegExp key`). The requested _X_ must contain each of the _Y_ values. If the requested _X_ is singular, then the result is either the matching instance of _X_, or undefined. If the requested _X_ is plural, then the result is either an Array of the matching instances of _X_, or an empty Array.

* `getActionByClasses(classes)` - returns [Action](#action) or undefined
* `getActionsByClasses(classes)` - returns Array of [Action](#action) (empty Array if none match)
* `getFieldByClasses(classes)` - returns [Field](#field) or undefined
* `getFieldsByClasses(classes)` - returns Array of [Field](#field) (empty Array if none match)
* `getLinkByClasses(class)` - returns [Link](#link) or undefined
* `getLinksByClasses(class)` - return Array of [Link](#link) (empty Array if none match)
* `getLinkByRels(class)` - returns [Link](#link) or undefined
* `getLinksByRels(class)` - return Array of [Link](#link) (empty Array if none match)
* `getSubEntityByClasses(classes)` - returns [Entity](#entity) or undefined
* `getSubEntitiesByClasses(classes)` - returns Array of [Entity](#entity) (empty Array if none match)
* `getSubEntityByRels(classes)` - returns [Entity](#entity) or undefined
* `getSubEntitiesByRels(classes)` - returns Array of [Entity](#entity) (empty Array if none match)
```js
resource.getActionByClasses(['crazy', 'self']) // An action instance that contains both 'self' and 'crazy' classes.
resource.getActionsByClasses(['crazy', 'cool']) // Array containing two actions, both of which contain both 'crazy' and 'cool' classes. Note that an action containing only one of those will not be included in the array.
resource.getFieldByClasses(['crazy', 'self']) // A field instance that contains both 'self' and 'crazy' classes.
resource.getFieldsByClasses(['crazy', 'cool']) // Array containing two fields, both of which contain both 'crazy' and 'cool' classes. Note that a field containing only one of those will not be included in the array.
resource.getLinkByClasses(['crazy', 'self']) // A link instance that contains both 'self' and 'crazy' classes.
resource.getLinksByClasses(['crazy', 'cool']) // Array containing two links, both of which contain both 'crazy' and 'cool' classes. Note that a link containing only one of those will not be included in the array.
resource.getLinkByRels(['thing1', 'thing2']) // A link instance that contains both 'thing1' and 'thing2' rels.
resource.getLinksByRels(['thing1', 'thing2']) // Array containing two links, both of which contain both 'thing1' and 'thing2' rels. Note that a link containing only one of those will not be included in the array.
resource.getSubEntityByClasses(['crazy', 'self']) // An entity instance that contains both 'self' and 'crazy' classes.
resource.getSubEntitiesByClasses(['crazy', 'cool']) // Array containing two entities, both of which contain both 'crazy' and 'cool' classes. Note that an entity containing only one of those will not be included in the array.
resource.getSubEntityByRels(['thing1', 'thing2']) // An entity instance that contains both 'thing1' and 'thing2' rels.
resource.getSubEntitiesByRels(['thing1', 'thing2']) // Array containing two entities, both of which contain both 'thing1' and 'thing2' rels. Note that an entity containing only one of those will not be included in the array.
```

---

### `Link`

Attributes:

* `rel` (array of strings) _Required_
* `href` (string) _Required_
* `class` (array of strings)
* `title` (string)
* `type` (string) _Must be a [Siren Link type][link types]_

#### `Link.hasClass(String class)`

Links only have this one helper function. Returns true if the Link has the specified `class`, otherwise false.

```js
resource.getLink('crazy').hasClass('foo'); // false
```

---

### `Action`

Attributes:

* `name` (string) _Required_
* `href` (string) _Required_
* `class` (array of strings)
* `method` (string)
* `title` (string)
* `type` (string) _Must be a [Siren Action type][action types]_
* `fields` (array of [Fields](#field))

#### `Action.hasXByY(String|RegExp key)`

Returns true if the Action has an _X_ with a _Y_ of `key` (or which matches `RegExp key`), otherwise false.

* `hasFieldByName(name)` (`hasField(name)`) - returns true if any action on the entity has an action named `name`
* `hasFieldByClass(class)`
* `hasFieldByType(type)`
* `hasClass(class)`

```js
resource.hasClass('foo'); // false
resource.getActionByName('fancy-action').hasFieldByName('max'); // true
```

#### `Action.getXByY(String|RegExp key)`

Returns the resource(s) of type _X_ with a _Y_ value of `key` (or which matches `RegExp key`). If the requested _X_ is singular, then the result is either the matching instance of _X_, or undefined. If the requested _X_ is plural, then the result is either an Array of the matching instances of _X_, or an empty Array.

* `getFieldByName(name)` (`getField(name)`) - returns [Field](#field) or undefined
* `getFieldByClass(class)` - returns [Field](#field) or undefined
* `getFieldByType(type)` - returns [Field](#field) or undefined
* `getFieldsByClass(class)` - returns Array of [Fields](#field) (empty Array if none match)
* `getFieldsByType(type)` - returns Array of [Fields](#field) (empty Array if none match)

```js
resource.getActionByName('fancy-action').getFieldByName('max'); // The 'max' Field instance
resource.getActionByName('fancy-action').getFieldByName('max').title; // 'Maximum value'
```

---

### `Field`

Attributes:

* `name` (string) _Required_
* `value` (string)
* `class` (array of strings)
* `type` (string) _Must be a [Siren Field type][field types]_
* `title` (string)

#### `Field.hasClass(String class)`

Fields only have this one helper function. Returns true if the Field has the specified `class`, otherwise false.

```js
resource.getAction('fancy-action').getField('max').hasClass('foo'); // false
```

## `chai` interface

There are a few helper `chai` methods included with this module, under `./chai`. These are intended to make testing with `chai` cleaner. The chai interface adds the following methods and properties:

* Properties
  * sirenAction/sirenActions - changes the subject of the assertion to the entity's Actions (or throws if it has none)
  * sirenEntity/sirenEntities - changes the subject of the assertion to the entity's sub-Entities (or throws if it has none)
  * sirenLink/sirenLinks - changes the subject of the assertion to the entity's Links (or throws if it has none)
  * sirenProperty/sirenProperties - changes the subject of the assertion to the entity's Properties (or throws if it has none)
  * sirenField/sirenFields - changes the subject of the assertion to the action's Fields (or throws if it has none)
  * all - flags further operations to occur on all of the subject, rather than just any
* Methods:
  * classes(cls1, cls2, ...) - asserts whether the subject has all the given classes
  * href(href) - asserts whether the subject has the given href
  * method(method) - asserts whether the subject has the given method
  * name(name) - asserts whether the subject (Action(s)) has the given name
  * rels(rel1, rel2, ...) - asserts whether the subject has all the given rels
  * title(title) - asserts whether the subject has the given title
  * type(type) - asserts whether the subject has the given title
  * value(value) - asserts whether the subject (Field(s)) has the given value

```js
expect(resource).to.have.a.sirenAction.with.method('GET');
expect(resource).to.have.sirenLinks.with.classes('foo', 'bar'); // Will pass if at least 1 of resource's actions have each given class
expect(resource).to.have.sirenLinks.all.with.classes('foo', 'bar'); // Passes only if all of resource's actions have all given class
expect(resource).to.have.a.sirenEntity.with.a.sirenEntity.with.title('foo'); // Check a sub-sub-entity's title
```

## `superagent` interface

There are two helper `superagent` methods included with this module, under `./superagent`.

* `.parse(sirenSuperagent.parse)` - To be used with `superagent`'s `.parse()` method
* `sirenSuperagent.perform(request, action)` - Returns unended `superagent` request object

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

This repository is configured with [EditorConfig][EditorConfig] and [ESLint][ESLint]
and rules.

[node-siren-writer]: https://github.com/dominicbarnes/node-siren-writer
[chai]: https://github.com/chaijs/chai
[siren]: https://github.com/kevinswiber/siren
[link types]: https://github.com/kevinswiber/siren#type-1
[action types]: https://github.com/kevinswiber/siren#type-2
[field types]: https://github.com/kevinswiber/siren#type-3
[EditorConfig]: http://editorconfig.org/
[ESLint]: http://eslint.org
