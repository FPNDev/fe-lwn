import { Changes } from "../changes";
import { LifecycleHooks } from "./hooks";
export interface LCInit {
    [LifecycleHooks.Init](): void;
}
export interface LCChange {
    [LifecycleHooks.Change](changes: Changes): void;
}
export interface LCDestroy {
    [LifecycleHooks.Destroy](): void;
}
