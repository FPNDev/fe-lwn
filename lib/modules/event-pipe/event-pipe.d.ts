import { Callable } from '../../shared/core/callable';
export declare class EventPipe<T = any> extends Callable {
    private subscribers;
    constructor();
    emit(value: T): void;
    subscribe(fn: Function): any;
    close(): void;
    unsubscribe(subscription: EventPipeSubscription<T>): void;
    _call(value: T): void;
}
export declare class EventPipeSubscription<T = any> {
    private pipe;
    private fn;
    constructor(pipe: EventPipe, fn: Function);
    /** @internal */
    _emit(value: T): void;
    unsubscribe(): void;
}
