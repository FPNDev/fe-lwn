import { MetadataBindingTypes } from "../enum/metadata";
export declare function In(): (target: any, propertyKey: string) => void;
export declare function Out(): (target: any, propertyKey: string) => void;
export declare function Pipe(): (target: any, propertyKey: string) => void;
export declare function getBindings(metadataKey: MetadataBindingTypes, target: any): any;
