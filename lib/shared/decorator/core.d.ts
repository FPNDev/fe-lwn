import { MetadataCoreDecorators } from "../enum/metadata";
export declare namespace Core {
    function DirectiveParser(): (target: any, propertyKey: string) => void;
    function ChangeDetector(): (target: any, propertyKey: string) => void;
    function Parent(): (target: any, propertyKey: string) => void;
}
export declare function getCoreComponentDecorators(metadataKey: MetadataCoreDecorators, target: any): any;
