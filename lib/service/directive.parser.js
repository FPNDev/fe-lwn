import { lwnEval } from "../core/eval";
import { getBindings } from "../decorator/bindings";
import { getBind } from "../decorator/directive";
import { getDOM } from "../decorator/dom";
import { Metadata, MetadataBindingTypes, MetadataDOMDecorators } from "../interface/metadata";
const StructuralDirectives = {
    if: structuralIf,
    for: structuralFor
};
export class DirectiveParser {
    constructor(component) {
        this.component = component;
        this.nodesCustomContext = new Map();
    }
    getContextNodes() {
        return [...this.nodesCustomContext.keys()];
    }
    fetchServices() {
        this.drawService = Reflect.getMetadata(Metadata.ComponentDrawService, this.component);
        this.changeDetector = Reflect.getMetadata(Metadata.ComponentChangeDetectorRef, this.component);
    }
    preparse(isComponent) {
        this.nodesCustomContext.clear();
        if (isComponent) {
            this.registerStructuralDirectives();
        }
        this.registerRefs(isComponent);
    }
    parse(isComponent) {
        if (isComponent) {
            this.registerBindingDirectives();
            this.registerEventDirectives();
        }
    }
    registerRefs(isComponent) {
        const selfDOM = Reflect.getMetadata(Metadata.ComponentElement, this.component);
        for (const decorator of getDOM(MetadataDOMDecorators.DecoratorDOMSelf, this.component)) {
            this.component[decorator.propertyKey] = selfDOM;
        }
        if (isComponent) {
            const container = this.drawService.getContainer();
            const decoratorRefs = getDOM(MetadataDOMDecorators.DecoratorDOMRefs, this.component);
            const decoratorRef = getDOM(MetadataDOMDecorators.DecoratorDOMRef, this.component);
            if (decoratorRefs.size || decoratorRef.size) {
                const resultRefs = {};
                const directives = document.evaluate(".//@*[starts-with(name(), '#')]", container, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
                for (let index = 0; index < directives.snapshotLength; index++) {
                    const attribute = directives.snapshotItem(index);
                    if (attribute.ownerElement === container) {
                        continue;
                    }
                    const attributeName = attribute.nodeName.slice(1);
                    resultRefs[attributeName] = attribute.ownerElement;
                }
                for (const decorator of decoratorRefs) {
                    this.component[decorator.propertyKey] = resultRefs;
                }
                for (const decorator of decoratorRef) {
                    this.component[decorator.propertyKey] = resultRefs[decorator.refName];
                }
            }
        }
    }
    registerEventDirectives() {
        const container = this.drawService.getContainer();
        const directives = document.evaluate(".//@*[starts-with(name(), '@')]", container, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
        for (let index = 0; index < directives.snapshotLength; index++) {
            const attribute = directives.snapshotItem(index);
            if (attribute.ownerElement === container) {
                continue;
            }
            const attributeName = attribute.nodeName.slice(1);
            const isPipe = attributeName[0] === ':';
            const isOut = attributeName[0] === '@';
            if (isPipe || isOut) {
                // create outs and pipes
                let elementComponent = Reflect.getMetadata(Metadata.CustomElementComponent, attribute.ownerElement);
                if (!elementComponent) {
                    elementComponent = checkAndRegisterBind(attribute);
                }
                if (elementComponent) {
                    const bindings = getBindings(isOut ?
                        MetadataBindingTypes.ComponentBindingsOutSet :
                        MetadataBindingTypes.ComponentBindingsPipeSet, elementComponent);
                    let thisContext = this.component;
                    const bindingName = attributeName.slice(1);
                    if (bindings.has(bindingName)) {
                        const childChangeDetector = Reflect.getMetadata(Metadata.ComponentChangeDetectorRef, elementComponent);
                        if (isOut) {
                            childChangeDetector.onUpdate(bindingName, (change) => {
                                const context = this.createContext(attribute.ownerElement);
                                Object.defineProperty(context, '$event', {
                                    value: change
                                });
                                try {
                                    lwnEval(attribute.value, context);
                                }
                                catch (e) {
                                }
                            });
                        }
                        else {
                            const propertyKey = attribute.value;
                            if (elementComponent[bindingName] !== thisContext[propertyKey]) {
                                if (![undefined, null].includes(thisContext[propertyKey])) {
                                    elementComponent[bindingName] = thisContext[propertyKey];
                                }
                                else {
                                    thisContext[propertyKey] = elementComponent[bindingName];
                                }
                            }
                            this.changeDetector.onUpdate(propertyKey, (change) => {
                                if (elementComponent[bindingName] !== thisContext[propertyKey]) {
                                    elementComponent[bindingName] = change.new;
                                }
                            });
                            childChangeDetector.onUpdate(bindingName, (change) => {
                                if (elementComponent[bindingName] !== thisContext[propertyKey]) {
                                    thisContext[propertyKey] = change.new;
                                }
                            });
                        }
                    }
                }
                continue;
            }
            attribute.ownerElement[`on${attributeName}`] = $event => {
                const context = this.createContext(attribute.ownerElement);
                Object.defineProperty(context, '$event', {
                    value: $event
                });
                try {
                    return lwnEval(attribute.value, context);
                }
                catch (e) {
                    return;
                }
            };
        }
    }
    registerBindingDirectives() {
        const container = this.drawService.getContainer();
        const directives = document.evaluate(".//@*[starts-with(name(), ':')]", container, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
        for (let index = 0; index < directives.snapshotLength; index++) {
            const attribute = directives.snapshotItem(index);
            if (attribute.ownerElement === container) {
                continue;
            }
            const context = this.createContext(attribute.ownerElement);
            let exprValue;
            try {
                exprValue = lwnEval(attribute.value, context);
            }
            catch (e) { }
            const attributeName = attribute.nodeName.slice(1);
            let elementComponent = Reflect.getMetadata(Metadata.CustomElementComponent, attribute.ownerElement);
            if (!elementComponent) {
                elementComponent = checkAndRegisterBind(attribute);
            }
            if (elementComponent) {
                const bindings = getBindings(MetadataBindingTypes.ComponentBindingsInSet, elementComponent);
                if (bindings.has(attributeName)) {
                    elementComponent[attributeName] = exprValue;
                    continue;
                }
            }
            if (attributeName.startsWith('class.')) {
                const className = attributeName.slice('class.'.length);
                if (exprValue) {
                    attribute.ownerElement.classList.add(className);
                }
                else {
                    attribute.ownerElement.classList.remove(className);
                }
                continue;
            }
            try {
                exprValue = exprValue.toString();
            }
            catch (e) { }
            if (attributeName.startsWith('style.')) {
                const styleName = attributeName.slice('style.'.length);
                attribute.ownerElement.style.setProperty(styleName, exprValue);
                continue;
            }
            attribute.ownerElement.setAttribute(attributeName, exprValue !== null && exprValue !== void 0 ? exprValue : '');
        }
    }
    registerStructuralDirectives() {
        const container = this.drawService.getContainer();
        const attrsDone = [];
        const self = this;
        function makeParse() {
            const directives = document.evaluate(".//@*[starts-with(name(), '*')]", container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
            for (let index = 0; index < directives.snapshotLength; index++) {
                const attribute = directives.snapshotItem(index);
                if (attribute.ownerElement === container || attrsDone.includes(attribute)) {
                    continue;
                }
                const attributeName = attribute.nodeName.slice(1);
                if (attributeName in StructuralDirectives) {
                    StructuralDirectives[attributeName](self, attribute);
                    attrsDone.push(attribute);
                    makeParse();
                    break;
                }
            }
        }
        makeParse();
    }
    createContext(element) {
        const newContext = Object.create(null);
        const nodes = [...this.nodesCustomContext.keys()];
        do {
            if (nodes.includes(element)) {
                const nodeContext = this.nodesCustomContext.get(element);
                for (const key in nodeContext) {
                    if (nodeContext.hasOwnProperty(key) && !(key in newContext)) {
                        newContext[key] = nodeContext[key];
                    }
                }
            }
        } while (element = element === null || element === void 0 ? void 0 : element.parentElement);
        const finalContext = Object.create(this.component);
        for (const property of Object.keys(newContext).reverse()) {
            Object.defineProperty(finalContext, property, { value: newContext[property] });
        }
        return finalContext;
    }
    addCustomContext(element, context) {
        var _a;
        this.nodesCustomContext.set(element, Object.assign(Object.assign({}, ((_a = this.nodesCustomContext.get(element)) !== null && _a !== void 0 ? _a : {})), context));
    }
}
function structuralIf(parser, attribute) {
    let exprValue;
    parser.createContext(attribute.ownerElement);
    try {
        exprValue = lwnEval(attribute.value, parser.createContext(attribute.ownerElement));
    }
    catch (e) { }
    if (!exprValue) {
        attribute.ownerElement.remove();
    }
}
function structuralFor(parser, attribute) {
    const re = /^\s*([\w_\-]+) in (.*?)\s*$/;
    const result = attribute.value.match(re);
    const originalNode = attribute.ownerElement;
    originalNode.removeAttribute(attribute.nodeName);
    if (result) {
        const exprValue = lwnEval(result[2], parser.createContext(originalNode));
        const parentElement = originalNode.parentElement;
        let lastElement = originalNode;
        if (Object.prototype.isPrototypeOf(exprValue)) {
            for (const singleItemKey in exprValue) {
                if (exprValue.hasOwnProperty(singleItemKey)) {
                    const clone = originalNode.cloneNode(true);
                    parser.addCustomContext(clone, { [result[1]]: exprValue[singleItemKey] });
                    parentElement.insertBefore(clone, lastElement.nextSibling);
                    lastElement = clone;
                    originalNode.remove();
                }
            }
        }
    }
}
function checkAndRegisterBind(attribute) {
    const bind = getBind(attribute.nodeName);
    if (bind) {
        const bindInstance = new bind(attribute.ownerElement);
        Reflect.defineMetadata(Metadata.CustomElementComponent, bindInstance, attribute.ownerElement);
        return bindInstance;
    }
}
