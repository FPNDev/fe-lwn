export declare class DirectiveParser {
    private component;
    private nodesCustomContext;
    private drawService;
    private changeDetector;
    constructor(component: any);
    getContextNodes(): Element[];
    fetchServices(): void;
    preparse(isComponent: boolean): void;
    parse(isComponent: boolean): void;
    private registerRefs;
    private registerEventDirectives;
    private registerBindingDirectives;
    private registerStructuralDirectives;
    createContext(element: Element): any;
    addCustomContext(element: Element, context: {
        [key: string]: any;
    }): void;
}
