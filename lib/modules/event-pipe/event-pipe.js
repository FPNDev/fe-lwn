import { Callable } from '../../shared/core/callable';
export class EventPipe extends Callable {
    constructor() {
        super();
        this.subscribers = new Set();
    }
    emit(value) {
        for (const subscriber of this.subscribers) {
            subscriber._emit(value);
        }
    }
    subscribe(fn) {
        const subscription = new EventPipeSubscription(this, fn);
        this.subscribers.add(subscription);
        return subscription;
    }
    close() {
        this.subscribers.clear();
    }
    unsubscribe(subscription) {
        this.subscribers.delete(subscription);
    }
    _call(value) {
        this.emit(value);
    }
}
export class EventPipeSubscription {
    constructor(pipe, fn) {
        this.pipe = pipe;
        this.fn = fn;
    }
    /** @internal */
    _emit(value) {
        (this.fn)(value);
    }
    unsubscribe() {
        this.pipe.unsubscribe(this);
    }
}
