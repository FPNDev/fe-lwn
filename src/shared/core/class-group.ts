import { Callable } from "./callable";

export function group<T = any>(entities: T[]): T {
    return new Proxy({} as any, {
        get(_, property) {
            const valueOf = entities.map(entity => entity[property]);

            return new (class extends Callable {
                _call(...args: any[]) {
                    return entities.map(entity => entity[property](...args));
                }
                valueOf() { return valueOf; }
            });
        },
        set(_, property, value) {
            for (const entity of entities) {
                entity[property] = value;
            }

            return true;
        }
    }) as T;
    
}