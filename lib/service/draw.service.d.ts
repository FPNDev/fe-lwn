export declare class DrawService {
    private component;
    private container;
    private drawData;
    private styleText;
    constructor(component: any);
    predraw(): void;
    postdraw(contextNodes: Element[], contextFn: (e: Element) => any): void;
    getContainer(): HTMLElement;
    setContainer(container: HTMLElement): void;
    setStyleText(cssText: string): void;
}
