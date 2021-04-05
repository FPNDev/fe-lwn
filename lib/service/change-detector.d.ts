import { Changes, Change } from "../interface/changes";
export declare class ChangeDetector {
    private componentInstance;
    static readonly refs: Map<any, ChangeDetector>;
    private touched;
    private lastValue;
    private drawService;
    private directiveParser;
    private changeListeners;
    get isTouched(): boolean;
    constructor(componentInstance: any);
    markAsTouched(property: string): void;
    setLastValue(property: string, value: any): void;
    getRealChanges(): Changes<any>;
    onUpdate(propertyKey: string, fn: (change: Change) => void): void;
    resetListeners(): void;
    runUpdate(forceRedraw?: boolean): void;
    static registerDetector(componentClass: any): any;
    private runUpdateListeners;
    static destroyDetector(componentClass: any): void;
    private setupServices;
    private setDefaultLastValue;
}
