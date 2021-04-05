export enum MetadataBase {
    IsComponent = 'lwn:IsComponent',

    ComponentHTMLTemplate = 'lwn:HTML',
    ComponentCSSTemplate = 'lwn:CSS',
    ComponentStateActive = 'lwn:Active',
    ComponentDrawService = 'lwn:DrawService',
    ComponentDirectiveParser = 'lwn:DirectiveParser',
    ComponentChangeDetectorRef = 'lwn:ChangeDetectorRef',

    CustomElementComponent = 'lwn:ComponentClass',
    ComponentElement = 'lwn:ComponentElement',

    DOMParentComponent = 'lwn:DOMParentComponent'
}

export enum MetadataConfig {
    ComponentConfig = 'lwn:DecoratorComponentConfig'
}

export enum MetadataBindingTypes {
    ComponentBindingsInSet = 'lwn:Bindings:In',
    ComponentBindingsOutSet = 'lwn:Bindings:Out',
    ComponentBindingsPipeSet = 'lwn:Bindings:Pipe',
}

export enum MetadataDOMDecorators {
    DecoratorDOMSelf = 'lwn:decorator:DOM.Self',
    DecoratorDOMRef = 'lwn:decorator:DOM.Ref',
    DecoratorDOMRefs = 'lwn:decorator:DOM.Refs',
}

export enum MetadataCoreDecorators {
    DecoratorCoreDirectiveParser = 'lwn:decorator:Core.DirectiveParser',
    DecoratorCoreChangeDetector = 'lwn:decorator:Core.ChangeDetector',
    DecoratorCoreParent = 'lwn:decorator:Core.Parent'
}

export const Metadata = { 
    ...MetadataBase, 
    ...MetadataBindingTypes, 
    ...MetadataDOMDecorators, 
    ...MetadataConfig 
};

export type Metadata = 
    typeof MetadataBase | 
    typeof MetadataBindingTypes | 
    typeof MetadataDOMDecorators | 
    typeof MetadataConfig;