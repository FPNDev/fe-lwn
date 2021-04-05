export interface DirectiveConstructor {
    selector: string;
}

export interface ComponentConstructor extends DirectiveConstructor {
    template: string;
    styles?: string[]
}
