import { DirectiveConstructor } from "../interface/constructor/component";
export declare function Bind(decoratorConfig: DirectiveConstructor): (bindClass: new (...args: any[]) => any) => any;
export declare function getBind(key: string): new (element: Element, ...args: any[]) => any;
export declare const Directive: typeof Bind;
