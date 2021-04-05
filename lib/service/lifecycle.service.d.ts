import { LifecycleHooks } from "../interface/lifecycle/hooks";
export declare class LifecycleService {
    static run(hook: LifecycleHooks, args: any[] | null, component: any): boolean | void;
}
