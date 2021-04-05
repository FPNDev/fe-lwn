export type Changes<T = any> = { [_: string]: Change };
export type Change<T = any> = {
    old: T;
    new: T;
};
