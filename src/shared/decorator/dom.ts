import { Metadata, MetadataDOMDecorators } from "../enum/metadata"

export namespace DOM {
    export function Self() {
        return (target: any, propertyKey: string) => {
            getDOM(MetadataDOMDecorators.DecoratorDOMSelf, target).add({ propertyKey });
        }
    }
    export function Ref(refName: string) {
        return (target: any, propertyKey: string) => {
            getDOM(MetadataDOMDecorators.DecoratorDOMRef, target).add({ refName, propertyKey });
        }
    }
    export function Refs() {
        return (target: any, propertyKey: string) => {
            getDOM(MetadataDOMDecorators.DecoratorDOMRefs, target).add({ propertyKey });
        }
    }
}

export function getDOM(metadataKey: MetadataDOMDecorators, target: any) {
    let propertySet = Reflect.getMetadata(metadataKey, target);
    
    if (!propertySet) {
        propertySet = new Set<string>();
        Reflect.defineMetadata(metadataKey, propertySet, target);
    }

    return propertySet;
}