import { MetadataBindingTypes } from "../interface/metadata";
export function In() {
    return (target, propertyKey) => {
        getBindings(MetadataBindingTypes.ComponentBindingsInSet, target).add(propertyKey);
    };
}
export function Out() {
    return (target, propertyKey) => {
        getBindings(MetadataBindingTypes.ComponentBindingsOutSet, target).add(propertyKey);
    };
}
export function Pipe() {
    return (target, propertyKey) => {
        getBindings(MetadataBindingTypes.ComponentBindingsPipeSet, target).add(propertyKey);
    };
}
export function getBindings(metadataKey, target) {
    let bindingsSet = Reflect.getMetadata(metadataKey, target);
    if (!bindingsSet) {
        bindingsSet = new Set();
        Reflect.defineMetadata(metadataKey, bindingsSet, target);
    }
    return bindingsSet;
}
