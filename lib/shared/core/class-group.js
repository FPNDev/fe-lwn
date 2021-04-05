import { Callable } from "./callable";
export function group(entities) {
    return new Proxy({}, {
        get(_, property) {
            const valueOf = entities.map(entity => entity[property]);
            return new (class extends Callable {
                _call(...args) {
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
    });
}
