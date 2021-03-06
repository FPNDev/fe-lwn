export var MetadataBase;
(function (MetadataBase) {
    MetadataBase["IsComponent"] = "lwn:IsComponent";
    MetadataBase["ComponentHTMLTemplate"] = "lwn:HTML";
    MetadataBase["ComponentCSSTemplate"] = "lwn:CSS";
    MetadataBase["ComponentStateActive"] = "lwn:Active";
    MetadataBase["ComponentDrawService"] = "lwn:DrawService";
    MetadataBase["ComponentDirectiveParser"] = "lwn:DirectiveParser";
    MetadataBase["ComponentChangeDetectorRef"] = "lwn:ChangeDetectorRef";
    MetadataBase["CustomElementComponent"] = "lwn:CustomElementComponent";
    MetadataBase["ComponentElement"] = "lwn:ComponentElement";
    MetadataBase["DOMParentComponent"] = "lwn:DOMParentComponent";
    MetadataBase["ComponentClass"] = "lwn:ComponentClass";
})(MetadataBase || (MetadataBase = {}));
export var MetadataConfig;
(function (MetadataConfig) {
    MetadataConfig["ComponentConfig"] = "lwn:DecoratorComponentConfig";
})(MetadataConfig || (MetadataConfig = {}));
export var MetadataBindingTypes;
(function (MetadataBindingTypes) {
    MetadataBindingTypes["ComponentBindingsInSet"] = "lwn:Bindings:In";
    MetadataBindingTypes["ComponentBindingsOutSet"] = "lwn:Bindings:Out";
    MetadataBindingTypes["ComponentBindingsPipeSet"] = "lwn:Bindings:Pipe";
})(MetadataBindingTypes || (MetadataBindingTypes = {}));
export var MetadataDOMDecorators;
(function (MetadataDOMDecorators) {
    MetadataDOMDecorators["DecoratorDOMSelf"] = "lwn:decorator:DOM.Self";
    MetadataDOMDecorators["DecoratorDOMRef"] = "lwn:decorator:DOM.Ref";
    MetadataDOMDecorators["DecoratorDOMRefs"] = "lwn:decorator:DOM.Refs";
})(MetadataDOMDecorators || (MetadataDOMDecorators = {}));
export var MetadataCoreDecorators;
(function (MetadataCoreDecorators) {
    MetadataCoreDecorators["DecoratorCoreDirectiveParser"] = "lwn:decorator:Core.DirectiveParser";
    MetadataCoreDecorators["DecoratorCoreChangeDetector"] = "lwn:decorator:Core.ChangeDetector";
    MetadataCoreDecorators["DecoratorCoreParent"] = "lwn:decorator:Core.Parent";
})(MetadataCoreDecorators || (MetadataCoreDecorators = {}));
export const Metadata = Object.assign(Object.assign(Object.assign(Object.assign({}, MetadataBase), MetadataBindingTypes), MetadataDOMDecorators), MetadataConfig);
