import { ComponentConstructor } from '../interface/constructor/component';
export declare function Component(decoratorConfig: ComponentConstructor): (componentClass: new (...args: any[]) => any) => any;
export declare function getCustomComponents(): {
    [componentName: string]: any;
};
