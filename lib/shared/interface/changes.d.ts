export declare type Changes<T = any> = {
    [_: string]: Change;
};
export declare type Change<T = any> = {
    old: T;
    new: T;
};
