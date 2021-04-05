import { DummyElementTagName } from "../constant/common";
import { interpolate } from "../core/interpolation";
import { Metadata } from "../enum/metadata";

export class DrawService {
    private container: HTMLElement = document.createElement('div');
    private mainContainer: HTMLElement;

    private drawData: { initialHTML: string, config: string[] };
    private styleText: string | undefined;

    constructor(private component: any) {
        const classConstructor = Reflect.getPrototypeOf(this.component).constructor;
        this.drawData = Reflect.getMetadata(Metadata.ComponentHTMLTemplate, classConstructor);
    }

    predraw() {
        if (!this.container) {
            return;
        }

        this.container.innerHTML = `
            ${this.drawData.initialHTML}
            ${this.styleText ? `<style>${this.styleText}</style>` : ''}
        `;
    }

    draw(contextNodes: Element[], contextFn: (e: Element) => any) {
        for (const contextElement of contextNodes.reverse()) {
            interpolate(contextElement, this.drawData.config, contextFn(contextElement));
        }

        interpolate(this.container, this.drawData.config, this.component);
    }

    postdraw() {
        const array = Array.prototype.slice.call(this.container.querySelectorAll(DummyElementTagName));

        for (const dummyElement of array) {
            const refNode = dummyElement.nextSibling;

            while (dummyElement.childNodes.length > 0) {
                dummyElement.parentElement.insertBefore(dummyElement.childNodes[0], refNode);
            }

            dummyElement.remove();
        }
    }

    getContainer(): HTMLElement {
        return this.container;
    }
    setMainContainer(container: HTMLElement): void {
        this.container = container;
    }

    setStyleText(cssText: string) {
        this.styleText = cssText;
    }
}