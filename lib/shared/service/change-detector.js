import { LifecycleHooks } from "../interface/lifecycle/hooks";
import { Metadata } from "../enum/metadata";
import { DirectiveParser } from "./directive.parser";
import { DrawService } from "./draw.service";
import { LifecycleService } from "./lifecycle.service";
export class ChangeDetector {
    constructor(componentInstance) {
        this.componentInstance = componentInstance;
        this.touched = new Set();
        this.lastValue = new Map();
        this.changeListeners = new Map();
        this.setupServices();
        this.setDefaultLastValue();
    }
    get isTouched() {
        return !!this.touched.size;
    }
    forceChange(property, value) {
        const changes = { [property]: { old: this.componentInstance[property], new: value } };
        this.lastValue.set(property, value);
        this.componentInstance[property] = value;
        this.runUpdateListeners(property, changes[property]);
        LifecycleService.run(LifecycleHooks.Change, [changes], this.componentInstance);
    }
    markAsTouched(property) {
        this.touched.add(property);
    }
    setLastValue(property, value) {
        this.lastValue.set(property, value);
    }
    getRealChanges() {
        let changes = {};
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
    onUpdate(propertyKey, fn) {
        let listenerStorage = this.changeListeners.get(propertyKey);
        if (!listenerStorage) {
            listenerStorage = new Set();
            this.changeListeners.set(propertyKey, listenerStorage);
        }
        listenerStorage.add(fn);
    }
    resetListeners() {
        this.changeListeners.clear();
    }
    runUpdate(forceRedraw) {
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
            }
            else {
                this.directiveParser.preparse(isComponent);
                this.directiveParser.parse(isComponent);
            }
            hasChanges && LifecycleService.run(LifecycleHooks.Change, [changes], this.componentInstance);
        }
    }
    static registerDetector(componentClass) {
        let detectorInstance;
        const detectorProxy = new Proxy(componentClass, {
            set(target, property, value) {
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
    runUpdateListeners(property, change) {
        const listeners = this.changeListeners.get(property) || [];
        for (const listenerFn of listeners) {
            listenerFn(change);
        }
    }
    static destroyDetector(componentClass) {
        ChangeDetector.refs.delete(componentClass);
    }
    setupServices() {
        this.drawService = Reflect.getMetadata(Metadata.ComponentDrawService, this.componentInstance);
        this.directiveParser = Reflect.getMetadata(Metadata.ComponentDirectiveParser, this.componentInstance);
    }
    setDefaultLastValue() {
        const props = Object.getOwnPropertyDescriptors(this.componentInstance);
        for (const propName of Object.keys(props)) {
            this.markAsTouched(propName);
        }
        this.markedDefaultLastValues = true;
    }
}
ChangeDetector.refs = new Map();
function runChangeDetection() {
    for (const ref of ChangeDetector.refs) {
        ref[1].runUpdate();
    }
    requestAnimationFrame(runChangeDetection);
}
requestAnimationFrame(runChangeDetection);
