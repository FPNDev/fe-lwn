export declare enum MetadataBase {
    IsComponent = "lwn:IsComponent",
    ComponentHTMLTemplate = "lwn:HTML",
    ComponentCSSTemplate = "lwn:CSS",
    ComponentStateActive = "lwn:Active",
    ComponentDrawService = "lwn:DrawService",
    ComponentDirectiveParser = "lwn:DirectiveParser",
    ComponentChangeDetectorRef = "lwn:ChangeDetectorRef",
    CustomElementComponent = "lwn:CustomElementComponent",
    ComponentElement = "lwn:ComponentElement",
    DOMParentComponent = "lwn:DOMParentComponent",
    ComponentClass = "lwn:ComponentClass"
}
export declare enum MetadataConfig {
    ComponentConfig = "lwn:DecoratorComponentConfig"
}
export declare enum MetadataBindingTypes {
    ComponentBindingsInSet = "lwn:Bindings:In",
    ComponentBindingsOutSet = "lwn:Bindings:Out",
    ComponentBindingsPipeSet = "lwn:Bindings:Pipe"
}
export declare enum MetadataDOMDecorators {
    DecoratorDOMSelf = "lwn:decorator:DOM.Self",
    DecoratorDOMRef = "lwn:decorator:DOM.Ref",
    DecoratorDOMRefs = "lwn:decorator:DOM.Refs"
}
export declare enum MetadataCoreDecorators {
    DecoratorCoreDirectiveParser = "lwn:decorator:Core.DirectiveParser",
    DecoratorCoreChangeDetector = "lwn:decorator:Core.ChangeDetector",
    DecoratorCoreParent = "lwn:decorator:Core.Parent"
}
export declare const Metadata: {
    ComponentConfig: MetadataConfig.ComponentConfig;
    DecoratorDOMSelf: MetadataDOMDecorators.DecoratorDOMSelf;
    DecoratorDOMRef: MetadataDOMDecorators.DecoratorDOMRef;
    DecoratorDOMRefs: MetadataDOMDecorators.DecoratorDOMRefs;
    ComponentBindingsInSet: MetadataBindingTypes.ComponentBindingsInSet;
    ComponentBindingsOutSet: MetadataBindingTypes.ComponentBindingsOutSet;
    ComponentBindingsPipeSet: MetadataBindingTypes.ComponentBindingsPipeSet;
    IsComponent: MetadataBase.IsComponent;
    ComponentHTMLTemplate: MetadataBase.ComponentHTMLTemplate;
    ComponentCSSTemplate: MetadataBase.ComponentCSSTemplate;
    ComponentStateActive: MetadataBase.ComponentStateActive;
    ComponentDrawService: MetadataBase.ComponentDrawService;
    ComponentDirectiveParser: MetadataBase.ComponentDirectiveParser;
    ComponentChangeDetectorRef: MetadataBase.ComponentChangeDetectorRef;
    CustomElementComponent: MetadataBase.CustomElementComponent;
    ComponentElement: MetadataBase.ComponentElement;
    DOMParentComponent: MetadataBase.DOMParentComponent;
    ComponentClass: MetadataBase.ComponentClass;
};
export declare type Metadata = typeof MetadataBase | typeof MetadataBindingTypes | typeof MetadataDOMDecorators | typeof MetadataConfig;
