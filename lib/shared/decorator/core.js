import { MetadataCoreDecorators } from "../enum/metadata";
export var Core;
(function (Core) {
    function DirectiveParser() {
        return (target, propertyKey) => {
            getCoreComponentDecorators(MetadataCoreDecorators.DecoratorCoreDirectiveParser, target).add({ propertyKey });
        };
    }
    Core.DirectiveParser = DirectiveParser;
    function ChangeDetector() {
        return (target, propertyKey) => {
            getCoreComponentDecorators(MetadataCoreDecorators.DecoratorCoreChangeDetector, target).add({ propertyKey });
        };
    }
    Core.ChangeDetector = ChangeDetector;
    function Parent() {
        return (target, propertyKey) => {
            getCoreComponentDecorators(MetadataCoreDecorators.DecoratorCoreParent, target).add({ propertyKey });
        };
    }
    Core.Parent = Parent;
})(Core || (Core = {}));
export function getCoreComponentDecorators(metadataKey, target) {
    let propertySet = Reflect.getMetadata(metadataKey, target);
    if (!propertySet) {
        propertySet = new Set();
        Reflect.defineMetadata(metadataKey, propertySet, target);
    }
    return propertySet;
}
