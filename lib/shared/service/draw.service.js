import { DummyElementTagName } from "../constant/common";
import { interpolate } from "../core/interpolation";
import { Metadata } from "../enum/metadata";
export class DrawService {
    constructor(component) {
        this.component = component;
        this.container = document.createElement('div');
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
    draw(contextNodes, contextFn) {
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
    getContainer() {
        return this.container;
    }
    setMainContainer(container) {
        this.container = container;
    }
    setStyleText(cssText) {
        this.styleText = cssText;
    }
}
