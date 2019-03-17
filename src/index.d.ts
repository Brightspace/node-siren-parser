import { Action } from './Action'
import { Link } from './Link'

declare interface IEntity {
	rel?: string[];
	title?: string;
	type?: string;
	properties?: Object;
	class?: string[];
	actions?: Action[];
	links?: Link[];
	entities?: SubEntity[];
}

declare interface ISubEntity {
	class?: string[];
	rel: string[];
	href?: string;
	title?: string;
	type?: string;
	actions?: Action[];
	links?: Link[];
	entities?: ISubEntity[];
	properties?: Object;
}

declare type StringOrRegExp = string | RegExp;

declare abstract class EntityBase {
	public hasAction(name: StringOrRegExp): boolean;
	public hasActionByName(name: StringOrRegExp): boolean;
	public hasActionByClass(className: StringOrRegExp): boolean;
	public hasActionByMethod(method: StringOrRegExp): boolean;
	public hasActionByType(type: StringOrRegExp): boolean;
	public hasClass(className: StringOrRegExp): boolean;

	public hasEntity(rel: StringOrRegExp): boolean;
	public hasEntityByRel(rel: StringOrRegExp): boolean;
	public hasEntityByClass(className: StringOrRegExp): boolean;
	public hasEntityByType (type: StringOrRegExp): boolean;
	public hasSubEntityByRel (rel: StringOrRegExp): boolean;
	public hasSubEntityByClass (className: StringOrRegExp): boolean;
	public hasSubEntityByType (type: StringOrRegExp): boolean;

	public hasLink(rel: StringOrRegExp): boolean;
	public hasLinkByRel(rel: StringOrRegExp): boolean;
	public hasLinkByClass(className: StringOrRegExp): boolean;
	public hasLinkByType(type: StringOrRegExp): boolean;

	public hasProperty(propName: StringOrRegExp): boolean;

	public getAction(name: StringOrRegExp): Action | undefined;
	public getActionByName(name: string): Action | undefined;
	public getActionByClass(className: StringOrRegExp): Action | undefined;
	public getActionByClasses(actionClasses: StringOrRegExp[]): Action | undefined;
	public getActionByMethod(method: StringOrRegExp): Action | undefined;
	public getActionByType(type: StringOrRegExp): Action | undefined;

	public getActionsByClass(className: StringOrRegExp): Action[];
	public getActionsByClasses(actionClasses: StringOrRegExp[]): Action[];
	public getActionsByType(type: StringOrRegExp): Action[];
	public getActionsByMethod(method: StringOrRegExp): Action[];

	public getLink(rel: StringOrRegExp): Link | undefined;
	public getLinkByRel(rel: StringOrRegExp): Link | undefined;
	public getLinkByRels(rels: StringOrRegExp[]): Link | undefined;
	public getLinkByClass(className: StringOrRegExp): Link | undefined;
	public getLinkByClasses(classes: StringOrRegExp[]): Link | undefined;
	public getLinkByType(type: StringOrRegExp): Link | undefined;

	public getLinks(rel: StringOrRegExp): Link[];
	public getLinksByRel (rel: StringOrRegExp): Link[];
	public getLinksByRels(rels: StringOrRegExp[]): Link[];
	public getLinksByClass(className: StringOrRegExp): Link[];
	public getLinksByClasses(classes: StringOrRegExp[]): Link[];
	public getLinksByType(type: StringOrRegExp): Link[];

	public getSubEntity(rel: StringOrRegExp): SubEntity | undefined;
	public getSubEntityByRel(rel: StringOrRegExp): SubEntity | undefined;
	public getSubEntityByRels(rels: StringOrRegExp[]): SubEntity | undefined;
	public getSubEntityByClass(className: StringOrRegExp): SubEntity | undefined;
	public getSubEntityByClasses(classes: StringOrRegExp[]): SubEntity | undefined;
	public getSubEntityByType(type: StringOrRegExp): SubEntity | undefined;

	public getSubEntities(rel: StringOrRegExp): SubEntity[];
	public getSubEntitiesByRel(rel: StringOrRegExp): SubEntity[];
	public getSubEntitiesByRels(rels: StringOrRegExp[]): SubEntity[];
	public getSubEntitiesByClass(className: StringOrRegExp): SubEntity[];
	public getSubEntitiesByClasses(classes: StringOrRegExp[]): SubEntity[];
	public getSubEntitiesByType(type: StringOrRegExp): SubEntity[];
}

declare class Entity extends EntityBase implements IEntity {
	rel?: string[];
	title?: string;
	type?: string;
	properties?: Object;
	class?: string[];
	actions?: Action[];
	links?: Link[];
	entities?: SubEntity[];

	constructor(entity?: IEntity);

	toJSON(): IEntity;
}

declare class SubEntity extends EntityBase implements ISubEntity {
	public class?: string[];
	public rel: string[];
	public href?: string;
	public title?: string;
	public type?: string;
	public actions?: Action[];
	public links?: Link[];
	public entities?: ISubEntity[];
	public properties?: Object;

	constructor(entity?: ISubEntity);

	public toJSON(): ISubEntity;
}
