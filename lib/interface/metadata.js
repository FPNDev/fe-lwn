export var MetadataBase;
(function (MetadataBase) {
    MetadataBase["IsComponent"] = "lwn:IsComponent";
    MetadataBase["ComponentHTMLTemplate"] = "lwn:HTML";
    MetadataBase["ComponentCSSTemplate"] = "lwn:CSS";
    MetadataBase["ComponentStateActive"] = "lwn:Active";
    MetadataBase["ComponentDrawService"] = "lwn:DrawService";
    MetadataBase["ComponentDirectiveParser"] = "lwn:DirectiveParser";
    MetadataBase["ComponentChangeDetectorRef"] = "lwn:ChangeDetectorRef";
    MetadataBase["CustomElementComponent"] = "lwn:ComponentClass";
    MetadataBase["ComponentElement"] = "lwn:ComponentElement";
})(MetadataBase || (MetadataBase = {}));
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
export const Metadata = Object.assign(Object.assign(Object.assign({}, MetadataBase), MetadataBindingTypes), MetadataDOMDecorators);
