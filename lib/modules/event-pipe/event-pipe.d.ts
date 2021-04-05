import { Callable } from '../../shared/core/callable';
export declare class EventPipe<T = any> extends Callable {
    private subscribers;
    constructor();
    emit(value: T): void;
    subscribe(fn: Function): void;
    close(): void;
    unsubscribe(subscription: EventPipeSubscription<T>): void;
    _call(value: T): void;
}
declare class EventPipeSubscription<T> {
    private pipe;
    private fn;
    constructor(pipe: EventPipe, fn: Function);
    /** @internal */
    _emit(value: T): void;
    unsubscribe(): void;
}
export {};
