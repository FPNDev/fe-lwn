import { Changes, Change } from "../interface/changes";
import { LifecycleHooks } from "../interface/lifecycle/hooks";
import { Metadata } from "../enum/metadata";
import { DirectiveParser } from "./directive.parser";
import { DrawService } from "./draw.service";
import { LifecycleService } from "./lifecycle.service";

export class ChangeDetector {
    static readonly refs: Map<any, ChangeDetector> = new Map<any, ChangeDetector>();

    private touched = new Set<string>();
    private lastValue = new Map<string, any>();

    private drawService: DrawService;
    private directiveParser: DirectiveParser;

    private changeListeners = new Map<string, Set<(change: Change) => void>>();
    
    private markedDefaultLastValues: boolean;

    get isTouched() {
        return !!this.touched.size;
    }

    constructor(
        private componentInstance: any
    ) {
        this.setupServices();
        this.setDefaultLastValue();
    }

    forceChange(property: string, value: any) {
        const changes: Changes = { [property]: { old: this.componentInstance[property], new: value } };

        this.lastValue.set(property, value);
        this.componentInstance[property] = value;

        this.runUpdateListeners(property, changes[property]);

        LifecycleService.run(LifecycleHooks.Change, [changes], this.componentInstance);
    }

    markAsTouched(property: string) {
        this.touched.add(property);
    }

    setLastValue(property: string, value: any) {
        this.lastValue.set(property, value);
    }

    getRealChanges() {
        let changes: Changes = {};

        if (this.touched.size) {
            for (const property of this.touched) {
                const oldValue = this.lastValue.get(property);
                const newValue = this.componentInstance[property];

                if (oldValue !== newValue) {
                    changes[property] = { old: oldValue, new: newValue };
                    this.lastValue.set(property, this.componentInstance[property]);
                }
            }
        }

        return changes;
    }

    onUpdate(propertyKey: string, fn: (change: Change) => void) {
        let listenerStorage = this.changeListeners.get(propertyKey);
        if (!listenerStorage) {
            listenerStorage = new Set<(change: Change) => void>();
            this.changeListeners.set(propertyKey, listenerStorage);
        }

        listenerStorage.add(fn);
    }

    resetListeners() {
        this.changeListeners.clear();
    }

    runUpdate(forceRedraw?: boolean) {
        if (this.markedDefaultLastValues) {
            this.markedDefaultLastValues = false;
            forceRedraw = true;
        }

        const changes = this.getRealChanges();
        this.touched.clear();

        const hasChanges = !!Object.keys(changes).length;

        if (hasChanges || forceRedraw) {
            if (hasChanges) {
                for (const change in changes) {
                    if (changes.hasOwnProperty(change)) {
                        this.runUpdateListeners(change, changes[change]);
                    }
                }
            }

            const isComponent = !!Reflect.getMetadata(Metadata.IsComponent, this.componentInstance);

            if (isComponent) {
                this.drawService.predraw();
                this.directiveParser.preparse(isComponent);

                this.drawService.draw(this.directiveParser.getContextNodes(), node => this.directiveParser.createContext(node));
                this.directiveParser.parse(isComponent);

                this.drawService.postdraw();
            } else {
                this.directiveParser.preparse(isComponent);
                this.directiveParser.parse(isComponent);
            }

            hasChanges && LifecycleService.run(LifecycleHooks.Change, [changes], this.componentInstance);
        }
    }

    static registerDetector(componentClass: any): any {
        let detectorInstance: ChangeDetector;

        const detectorProxy = new Proxy(componentClass, {
            set(target: any, property: string, value: any): boolean {
                detectorInstance && detectorInstance.markAsTouched(property);
                return Reflect.set(target, property, value);
            }
        });

        if (Reflect.getMetadata(Metadata.IsComponent, componentClass)) {
            const drawService = new DrawService(componentClass);
            Reflect.defineMetadata(Metadata.ComponentDrawService, drawService, detectorProxy);
        }

        const directiveParser = new DirectiveParser(detectorProxy);
        Reflect.defineMetadata(Metadata.ComponentDirectiveParser, directiveParser, detectorProxy);

        detectorInstance = new ChangeDetector(detectorProxy);
        Reflect.defineMetadata(Metadata.ComponentChangeDetectorRef, detectorInstance, detectorProxy);

        directiveParser.fetchServices();

        ChangeDetector.refs.set(detectorProxy, detectorInstance);

        return detectorProxy;
    }

    private runUpdateListeners(property: string, change: Change) {
        const listeners = this.changeListeners.get(property) || [];

        for (const listenerFn of listeners) {
            listenerFn(change);
        }
    }

    static destroyDetector(componentClass: any) {
        ChangeDetector.refs.delete(componentClass);
    }

    private setupServices() {
        this.drawService = Reflect.getMetadata(Metadata.ComponentDrawService, this.componentInstance);
        this.directiveParser = Reflect.getMetadata(Metadata.ComponentDirectiveParser, this.componentInstance);

    }

    private setDefaultLastValue() {
        const props = Object.getOwnPropertyDescriptors(this.componentInstance);
        for (const propName of Object.keys(props)) {
            this.markAsTouched(propName);
        }

        this.markedDefaultLastValues = true;
    }
}

function runChangeDetection() {
    for (const ref of ChangeDetector.refs) {
        ref[1].runUpdate();
    }

    requestAnimationFrame(runChangeDetection);
}

requestAnimationFrame(runChangeDetection);