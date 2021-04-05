import { interpolate } from "../core/interpolation";
import { Metadata } from "../interface/metadata";
export class DrawService {
    constructor(component) {
        this.component = component;
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
    postdraw(contextNodes, contextFn) {
        for (const contextElement of contextNodes.reverse()) {
            contextElement.innerHTML = interpolate(contextElement, contextFn(contextElement));
        }
        // this.container.innerHTML = interpolate(this.container, this.component);
    }
    getContainer() {
        return this.container;
    }
    setContainer(container) {
        this.container = container;
    }
    setStyleText(cssText) {
        this.styleText = cssText;
    }
}
