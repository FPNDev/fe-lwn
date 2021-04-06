import { ComponentConstructor } from '../interface/constructor/component';
import { LifecycleHooks } from '../interface/lifecycle/hooks';
import { Metadata } from '../enum/metadata';
import { ChangeDetector } from '../service/change-detector';
import { LifecycleService } from '../service/lifecycle.service';

export function Component(decoratorConfig: ComponentConstructor) {
  return (componentClass: { new(...args: any[]): any }): any => {
    const handlebarsHTML = <unknown>decoratorConfig.template;
    const cssText = decoratorConfig.styles?.map(
      style => (<unknown>style as any).default.toString()
    ).reduce((s1, s2) => s1 + s2, '');

    const newClass = new Proxy(componentClass, {
      construct(target, args) {
        const targetInstance = new target(...args);
        Reflect.defineMetadata(Metadata.IsComponent, true, targetInstance);

        const proxyInstance = ChangeDetector.registerDetector(targetInstance);
        Reflect.defineMetadata(Metadata.IsComponent, true, proxyInstance);

        return proxyInstance;
      }
    });

    Reflect.defineMetadata(Metadata.ComponentConfig, decoratorConfig, newClass);
    Reflect.defineMetadata(Metadata.IsComponent, true, componentClass);

    Reflect.defineMetadata(Metadata.ComponentHTMLTemplate, handlebarsHTML, componentClass);
    Reflect.defineMetadata(Metadata.ComponentCSSTemplate, cssText, componentClass);

    registerCustomElement(decoratorConfig, newClass, componentClass);

    return newClass;
  }
}

const ComponentDecorators: { [componentName: string]: any } = {};

export function getCustomComponents() {
  return ComponentDecorators;
}

function registerCustomElement(decoratorConfig: ComponentConstructor, newClass: any, componentClass: any) {
  ComponentDecorators[decoratorConfig.selector.toLowerCase()] = decoratorConfig;

  class CustomElement extends HTMLElement {
    private componentInstance: any;
    private changeDetector: ChangeDetector;

    private readonly cssText: string;

    constructor() {
      super();

      const cssText = Reflect.getMetadata(Metadata.ComponentCSSTemplate, componentClass) || '';

      const localStyleAttr =`_lwhost-${Math.random().toString(32).substr(2, 8)}`;
      this.setAttribute(localStyleAttr, '');

      this.cssText = cssText.replace(/^((?!['"]+)):host\b/gm, `$1[${localStyleAttr}]`);
    }

    private initComponent() {
      this.componentInstance = new newClass();
      
      Reflect.defineMetadata(Metadata.ComponentElement, this, this.componentInstance);
      Reflect.defineMetadata(Metadata.CustomElementComponent, this.componentInstance, this);

      const drawer = Reflect.getMetadata(Metadata.ComponentDrawService, this.componentInstance);
      drawer.setMainContainer(this);
      drawer.setStyleText(this.cssText);      

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