import { Field } from './Field';
import { StringOrRegExp } from '.';

declare interface IAction {
	name?: string;
	class?: string[];
	rel: string[];
	href: string;
	method: string;
	title?: string;
	type?: string;
	fields?: Field[];
}

declare class Action implements IAction {
	name?: string;
	class?: string[];
	rel: string[];
	href: string;
	method: string;
	title?: string;
	type?: string;
	fields?: Field[];

	constructor(action?: IAction);

	public toJSON(): IAction;

	public hasClass(className: StringOrRegExp): boolean;
	public hasField(name: StringOrRegExp): boolean;
	public hasFieldByName(name: StringOrRegExp): boolean;
	public hasFieldByClass(className: StringOrRegExp): boolean;
	public hasFieldByType(type: StringOrRegExp): boolean;

	public getField(name: StringOrRegExp)
	public getFieldByName(name: StringOrRegExp)
	public getFieldByClass(className: StringOrRegExp)
	public getFieldsByClass(className: StringOrRegExp)
	public getFieldByClasses(classes: StringOrRegExp[])
	public getFieldsByClasses(classes: StringOrRegExp[])
	public getFieldByType(type: StringOrRegExp)
	public getFieldsByType(type: StringOrRegExp)
}
