import { Callable } from '../../shared/core/callable';

export class EventPipe<T = any> extends Callable {
    private subscribers = new Set<EventPipeSubscription<T>>();

    constructor() {
        super();
    }

    emit(value: T) {
        for (const subscriber of this.subscribers) {
            subscriber._emit(value);
        }
    }
    subscribe(fn: Function) {
        this.subscribers.add(new EventPipeSubscription<T>(this, fn));
    }
    close() {
        this.subscribers.clear();
    }

    unsubscribe(subscription: EventPipeSubscription<T>) {
        this.subscribers.delete(subscription);
    }

    _call(value: T) {
        this.emit(value);
    }
}

class EventPipeSubscription<T> {
    constructor(private pipe: EventPipe, private fn: Function) {}

    /** @internal */
    _emit(value: T) {
        (this.fn)(value);
    }

    unsubscribe() {
        this.pipe.unsubscribe(this);
    }
}