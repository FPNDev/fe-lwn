import { MetadataCoreDecorators } from "../enum/metadata"

export namespace Core {
    export function DirectiveParser() {
        return (target: any, propertyKey: string) => {
            getCoreComponentDecorators(MetadataCoreDecorators.DecoratorCoreDirectiveParser, target).add({ propertyKey });
        }
    }
    export function ChangeDetector() {
        return (target: any, propertyKey: string) => {
            getCoreComponentDecorators(MetadataCoreDecorators.DecoratorCoreChangeDetector, target).add({ propertyKey });
        }
    }
    export function Parent() {
        return (target: any, propertyKey: string) => {
            getCoreComponentDecorators(MetadataCoreDecorators.DecoratorCoreParent, target).add({ propertyKey });
        }
    }
}

export function getCoreComponentDecorators(metadataKey: MetadataCoreDecorators, target: any) {
    let propertySet = Reflect.getMetadata(metadataKey, target);
    
    if (!propertySet) {
        propertySet = new Set<string>();
        Reflect.defineMetadata(metadataKey, propertySet, target);
    }

    return propertySet;
}