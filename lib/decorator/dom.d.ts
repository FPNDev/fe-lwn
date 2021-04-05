import { MetadataDOMDecorators } from "../interface/metadata";
export declare namespace DOM {
    function Self(): (target: any, propertyKey: string) => void;
    function Ref(refName: string): (target: any, propertyKey: string) => void;
    function Refs(): (target: any, propertyKey: string) => void;
}
export declare function getDOM(metadataKey: MetadataDOMDecorators, target: any): any;
