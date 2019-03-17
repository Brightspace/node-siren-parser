import { StringOrRegExp } from '.';

declare type FieldType =
	'hidden' |
	'text' |
	'search' |
	'tel' |
	'url' |
	'email' |
	'password' |
	'datetime' |
	'date'|
	'month'|
	'week'|
	'time'|
	'datetime-local'|
	'number'|
	'range'|
	'color'|
	'checkbox'|
	'radio'|
	'file';

declare interface IField {
	name: string;
	type: FieldType;
	class?: string[];
	title?: string;
	value: string | number | boolean;
}

declare class Field implements IField {
	public name: string;
	public type: FieldType;
	public class?: string[];
	public title?: string;
	public value: string | number | boolean;

	constructor(field?: IField);

	public toJSON(): IField;

	public hasClass(className: StringOrRegExp): boolean;
}
