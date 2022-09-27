import Entity from './Entity.js';

export { default as Action } from './Action.js';
export { default as Entity } from './Entity.js';
export { default as Field } from './Field.js';
export { default as Link } from './Link.js';

export default function SirenParse(json) {
	return new Entity(json);
}
