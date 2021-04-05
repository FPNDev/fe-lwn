import { MetadataDOMDecorators } from "../interface/metadata";
export var DOM;
(function (DOM) {
    function Self() {
        return (target, propertyKey) => {
            getDOM(MetadataDOMDecorators.DecoratorDOMSelf, target).add({ propertyKey });
        };
    }
    DOM.Self = Self;
    function Ref(refName) {
        return (target, propertyKey) => {
            getDOM(MetadataDOMDecorators.DecoratorDOMRef, target).add({ refName, propertyKey });
        };
    }
    DOM.Ref = Ref;
    function Refs() {
        return (target, propertyKey) => {
            getDOM(MetadataDOMDecorators.DecoratorDOMRefs, target).add({ propertyKey });
        };
    }
    DOM.Refs = Refs;
})(DOM || (DOM = {}));
export function getDOM(metadataKey, target) {
    let propertySet = Reflect.getMetadata(metadataKey, target);
    if (!propertySet) {
        propertySet = new Set();
        Reflect.defineMetadata(metadataKey, propertySet, target);
    }
    return propertySet;
}
