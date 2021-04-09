import { lwnEval } from "../core/eval";
import { getBindings } from "../decorator/bindings";
import { getBind } from "../decorator/directive";
import { getDOM } from "../decorator/dom";
import { Metadata, MetadataBindingTypes, MetadataCoreDecorators, MetadataDOMDecorators } from "../enum/metadata";
import { getCoreComponentDecorators } from "../decorator/core";
import { getCustomComponents } from "../decorator/component";
import { EventPipe } from "../../modules/event-pipe";
const StructuralDirectives = {
    if: structuralIf,
    for: structuralFor,
    else: structuralElse,
    all: structuralAll,
    any: structuralAny,
    nor: structuralNor,
};
export class DirectiveParser {
    constructor(component) {
        this.component = component;
        this.nodesCustomContext = new Map();
        this.lastIfStatements = new Map();
    }
    getContextNodes() {
        return [...this.nodesCustomContext.keys()];
    }
    fetchServices() {
        this.drawService = Reflect.getMetadata(Metadata.ComponentDrawService, this.component);
        this.changeDetector = Reflect.getMetadata(Metadata.ComponentChangeDetectorRef, this.component);
    }
    preparse(isComponent) {
        this.lastIfStatements.clear();
        this.nodesCustomContext.clear();
        if (isComponent) {
            this.registerStructuralDirectives();
        }
        this.registerRefs(isComponent);
    }
    parse(isComponent) {
        if (isComponent) {
            this.registerParents();
            this.registerBindingDirectives();
            this.registerEventDirectives();
        }
    }
    registerParents() {
        const componentList = getCustomComponents();
        const container = this.drawService.getContainer();
        for (const componentName in componentList) {
            if (componentList.hasOwnProperty(componentName)) {
                container.querySelectorAll(componentName)
                    .forEach(childComponentElement => {
                    Reflect.defineMetadata(Metadata.DOMParentComponent, this.component, childComponentElement);
                });
            }
        }
    }
    registerRefs(isComponent) {
        const selfDOM = Reflect.getMetadata(Metadata.ComponentElement, this.component);
        const parentComponent = Reflect.getMetadata(Metadata.DOMParentComponent, selfDOM);
        for (const decorator of getCoreComponentDecorators(MetadataCoreDecorators.DecoratorCoreParent, this.component)) {
            this.changeDetector.forceChange(decorator.propertyKey, parentComponent);
        }
        for (const decorator of getCoreComponentDecorators(MetadataCoreDecorators.DecoratorCoreChangeDetector, this.component)) {
            this.changeDetector.forceChange(decorator.propertyKey, this.changeDetector);
        }
        for (const decorator of getCoreComponentDecorators(MetadataCoreDecorators.DecoratorCoreDirectiveParser, this.component)) {
            this.changeDetector.forceChange(decorator.propertyKey, this);
        }
        for (const decorator of getDOM(MetadataDOMDecorators.DecoratorDOMSelf, this.component)) {
            this.changeDetector.forceChange(decorator.propertyKey, selfDOM);
        }
        if (isComponent) {
            const container = this.drawService.getContainer();
            const decoratorRefs = getDOM(MetadataDOMDecorators.DecoratorDOMRefs, this.component);
            const decoratorRef = getDOM(MetadataDOMDecorators.DecoratorDOMRef, this.component);
            if (decoratorRefs.size || decoratorRef.size) {
                const resultRefs = {};
                const directives = document.evaluate(".//@*[starts-with(name(), '#')]", container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
                for (let index = 0; index < directives.snapshotLength; index++) {
                    const attribute = directives.snapshotItem(index);
                    if (attribute.ownerElement === container) {
                        continue;
                    }
                    const attributeName = attribute.nodeName.slice(1);
                    resultRefs[attributeName] = attribute.ownerElement;
                }
                for (const decorator of decoratorRefs) {
                    this.changeDetector.forceChange(decorator.propertyKey, resultRefs);
                }
                for (const decorator of decoratorRef) {
                    this.changeDetector.forceChange(decorator.propertyKey, resultRefs[decorator.refName.toLowerCase()]);
                }
                this.changeDetector.runUpdate(true);
            }
        }
    }
    registerEventDirectives() {
        const container = this.drawService.getContainer();
        const directives = document.evaluate(".//@*[starts-with(name(), '@')]", container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
        for (let index = 0; index < directives.snapshotLength; index++) {
            const attribute = directives.snapshotItem(index);
            if (attribute.ownerElement === container) {
                continue;
            }
            const attributeName = attribute.nodeName.slice(1);
            const isPipe = attributeName[0] === ':';
            const isOut = attributeName[0] === '@';
            // create outs and pipes
            let elementComponent = Reflect.getMetadata(Metadata.CustomElementComponent, attribute.ownerElement);
            if (!elementComponent) {
                elementComponent = checkAndRegisterBind(attribute);
            }
            if (elementComponent) {
                const bindings = getBindings(!isPipe ?
                    MetadataBindingTypes.ComponentBindingsOutSet :
                    MetadataBindingTypes.ComponentBindingsPipeSet, elementComponent);
                let thisContext = this.component;
                const bindingName = isPipe || isOut ? attributeName.slice(1) : attributeName;
                if (bindings.has(bindingName)) {
                    const childChangeDetector = Reflect.getMetadata(Metadata.ComponentChangeDetectorRef, elementComponent);
                    if (!isPipe) {
                        if (isOut || !(elementComponent[bindingName] instanceof EventPipe)) {
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
                            elementComponent[bindingName].subscribe(emitedValue => {
                                const context = this.createContext(attribute.ownerElement);
                                Object.defineProperty(context, '$event', {
                                    value: emitedValue
                                });
                                try {
                                    lwnEval(attribute.value, context);
                                }
                                catch (e) {
                                }
                            });
                        }
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
                    continue;
                }
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
        const directives = document.evaluate(".//@*[starts-with(name(), ':')]", container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
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
    setLastIf(statementResult, parent) {
        var _a;
        this.lastIfStatements.set(parent, [...((_a = this.lastIfStatements.get(parent)) !== null && _a !== void 0 ? _a : []), statementResult]);
    }
    isLastIf(node) {
        var _a;
        const statements = (_a = this.lastIfStatements.get(node)) !== null && _a !== void 0 ? _a : [];
        return statements.some(statement => statement);
    }
    isAllIfTrue(node) {
        var _a;
        const statements = (_a = this.lastIfStatements.get(node)) !== null && _a !== void 0 ? _a : [];
        return !statements.some(statement => !statement);
    }
    getIfs(node) {
        var _a;
        return (_a = this.lastIfStatements.get(node)) !== null && _a !== void 0 ? _a : [];
    }
}
function structuralIf(parser, attribute) {
    let exprValue;
    try {
        exprValue = lwnEval(attribute.value, parser.createContext(attribute.ownerElement));
    }
    catch (e) { }
    parser.setLastIf(!!exprValue, attribute.ownerElement.parentNode);
    if (!exprValue) {
        attribute.ownerElement.remove();
    }
}
function structuralAny(parser, attribute) {
    if (parser.isLastIf(attribute.ownerElement.parentNode)) {
        if (attribute.value) {
            return structuralIf(parser, attribute);
        }
    }
    else {
        attribute.ownerElement.remove();
    }
}
function structuralNor(parser, attribute) {
    if (!parser.isAllIfTrue(attribute.ownerElement.parentNode)) {
        if (attribute.value) {
            return structuralIf(parser, attribute);
        }
    }
    else {
        attribute.ownerElement.remove();
    }
}
function structuralAll(parser, attribute) {
    if (parser.isAllIfTrue(attribute.ownerElement.parentNode)) {
        if (attribute.value) {
            return structuralIf(parser, attribute);
        }
    }
    else {
        attribute.ownerElement.remove();
    }
}
function structuralElse(parser, attribute) {
    if (!parser.isLastIf(attribute.ownerElement.parentNode)) {
        if (attribute.value) {
            return structuralIf(parser, attribute);
        }
    }
    else {
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
