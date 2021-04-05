export declare class DirectiveParser {
    private component;
    private nodesCustomContext;
    private drawService;
    private changeDetector;
    private lastIfStatements;
    constructor(component: any);
    getContextNodes(): Element[];
    fetchServices(): void;
    preparse(isComponent: boolean): void;
    parse(isComponent: boolean): void;
    registerParents(): void;
    registerRefs(isComponent: boolean): void;
    private registerEventDirectives;
    private registerBindingDirectives;
    private registerStructuralDirectives;
    createContext(element: Element): any;
    addCustomContext(element: Element, context: {
        [key: string]: any;
    }): void;
    setLastIf(statementResult: boolean, parent: Node): void;
    isLastIf(node: Node): boolean;
    isAllIfTrue(node: Node): boolean;
    getIfs(node: Node): boolean[];
}
