import { StringOrRegExp } from '.'

declare interface ILink {
	rel: string[];
	class?: string[];
	href: string;
	title?: string;
	type?: string;
}

declare class Link implements ILink {
	rel: string[];
	class?: string[];
	href: string;
	title?: string;
	type?: string;

	constructor(link?: ILink);

	hasClass(className: StringOrRegExp): boolean;
	toJSON(): ILink;
}
