import { LifecycleHooks } from "../interface/lifecycle/hooks";
import { Metadata } from "../enum/metadata";
import { ChangeDetector } from "../service/change-detector";
import { LifecycleService } from "../service/lifecycle.service";
const BindMap = new Map();
export function Bind(decoratorConfig) {
    return (bindClass) => {
        const newClass = new Proxy(bindClass, {
            construct(target, args) {
                let proxyInstance, targetInstance, changeDetector;
                function initDirective() {
                    targetInstance = new target(...args.slice(1));
                    proxyInstance = ChangeDetector.registerDetector(targetInstance);
                    Reflect.defineMetadata(Metadata.CustomElementComponent, proxyInstance, args[0]);
                    Reflect.defineMetadata(Metadata.ComponentElement, args[0], proxyInstance);
                    changeDetector = Reflect.getMetadata(Metadata.ComponentChangeDetectorRef, proxyInstance);
                }
                if (args[0].isConnected) {
                    initDirective();
                }
                args[0].addEventListener('DOMNodeInserted', ev => {
                    if (ev.target === args[0]) {
                        if (!Reflect.hasMetadata(Metadata.ComponentStateActive, proxyInstance)) {
                            initDirective();
                        }
                    }
                });
                args[0].addEventListener('DOMNodeRemoved', ev => {
                    if (ev.target === args[0]) {
                        LifecycleService.run(LifecycleHooks.Destroy, null, proxyInstance);
                    }
                });
                return proxyInstance;
            }
        });
        Reflect.defineMetadata(Metadata.IsComponent, false, bindClass);
        BindMap.set(decoratorConfig.selector, newClass);
        return newClass;
    };
}
export function getBind(key) {
    return BindMap.get(key);
}
export const Directive = Bind;
