import { LifecycleHooks } from '../interface/lifecycle/hooks';
import { Metadata } from '../interface/metadata';
import { ChangeDetector } from '../service/change-detector';
import { LifecycleService } from '../service/lifecycle.service';
export function Component(decoratorConfig) {
    return (componentClass) => {
        var _a;
        const handlebarsHTML = decoratorConfig.template;
        const cssText = (_a = decoratorConfig.styles) === null || _a === void 0 ? void 0 : _a.map(style => style.default.toString()).reduce((s1, s2) => s1 + s2, '');
        const newClass = new Proxy(componentClass, {
            construct(target, args) {
                const targetInstance = new target(...args);
                Reflect.defineMetadata(Metadata.IsComponent, true, targetInstance);
                const proxyInstance = ChangeDetector.registerDetector(targetInstance);
                Reflect.defineMetadata(Metadata.IsComponent, true, proxyInstance);
                return proxyInstance;
            }
        });
        Reflect.defineMetadata(Metadata.IsComponent, true, componentClass);
        Reflect.defineMetadata(Metadata.ComponentHTMLTemplate, handlebarsHTML, componentClass);
        Reflect.defineMetadata(Metadata.ComponentCSSTemplate, cssText, componentClass);
        registerCustomElement(decoratorConfig, newClass, componentClass);
        return newClass;
    };
}
function registerCustomElement(decoratorConfig, newClass, componentClass) {
    class CustomElement extends HTMLElement {
        constructor() {
            super();
        }
        initComponent() {
            let root = this;
            let cssText = Reflect.getMetadata(Metadata.ComponentCSSTemplate, componentClass) || '';
            const localStyleAttr = `_lwhost-${Math.random().toString(32).substr(2, 8)}`;
            this.setAttribute(localStyleAttr, '');
            cssText = cssText.replace(/^((?!['"]+)):host\b/gm, `$1[${localStyleAttr}]`);
            this.componentInstance = new newClass();
            Reflect.defineMetadata(Metadata.ComponentElement, this, this.componentInstance);
            Reflect.defineMetadata(Metadata.CustomElementComponent, this.componentInstance, this);
            const drawer = Reflect.getMetadata(Metadata.ComponentDrawService, this.componentInstance);
            drawer.setContainer(root);
            drawer.setStyleText(cssText);
            this.changeDetector = Reflect.getMetadata(Metadata.ComponentChangeDetectorRef, this.componentInstance);
        }
        connectedCallback() {
            this.initComponent();
        }
        disconnectedCallback() {
            LifecycleService.run(LifecycleHooks.Destroy, null, this.componentInstance);
        }
    }
    customElements.define(decoratorConfig.selector, CustomElement);
}
