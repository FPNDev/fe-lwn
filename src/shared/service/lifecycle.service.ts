import { LifecycleHooks } from "../interface/lifecycle/hooks";
import { Metadata } from "../enum/metadata";
import { ChangeDetector } from "./change-detector";

export class LifecycleService {
    static run(hook: LifecycleHooks, args: any[] | null, component: any): boolean | void {
        switch (hook) {
            case LifecycleHooks.Init:
                if (!Reflect.hasMetadata(Metadata.ComponentStateActive, component)) {
                    Reflect.defineMetadata(Metadata.ComponentStateActive, true, component);
                } else {
                    return;
                }
                
                break;
            case LifecycleHooks.Change:
                if (!Reflect.hasMetadata(Metadata.ComponentStateActive, component)) {
                    LifecycleService.run(LifecycleHooks.Init, null, component);
                }
                break;
            case LifecycleHooks.Destroy:
                if (Reflect.hasMetadata(Metadata.ComponentStateActive, component)) {
                    ChangeDetector.destroyDetector(component);
                    
                    Reflect.deleteMetadata(Metadata.ComponentStateActive, component);
                } else {
                    return;
                }
                break;
        }

        return hook in component && component[hook](...(args || []));
    }
}