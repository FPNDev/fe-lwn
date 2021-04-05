import { MetadataBindingTypes } from "../enum/metadata";

export function In() {
    return (target: any, propertyKey: string) => {
        getBindings(MetadataBindingTypes.ComponentBindingsInSet, target).add(propertyKey);
    }
}

export function Out() {
    return (target: any, propertyKey: string) => {
        getBindings(MetadataBindingTypes.ComponentBindingsOutSet, target).add(propertyKey);
    }
}

export function Pipe() {
    return (target: any, propertyKey: string) => {
        getBindings(MetadataBindingTypes.ComponentBindingsPipeSet, target).add(propertyKey);
    }
}

export function getBindings(metadataKey: MetadataBindingTypes, target: any) {
    let bindingsSet = Reflect.getMetadata(metadataKey, target);
    
    if (!bindingsSet) {
        bindingsSet = new Set<string>();
        Reflect.defineMetadata(metadataKey, bindingsSet, target);
    }

    return bindingsSet;
}