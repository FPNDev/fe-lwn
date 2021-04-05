export declare class DrawService {
    private component;
    private container;
    private mainContainer;
    private drawData;
    private styleText;
    constructor(component: any);
    predraw(): void;
    draw(contextNodes: Element[], contextFn: (e: Element) => any): void;
    postdraw(): void;
    getContainer(): HTMLElement;
    setMainContainer(container: HTMLElement): void;
    setStyleText(cssText: string): void;
}
