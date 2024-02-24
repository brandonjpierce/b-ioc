export function getBindings(): any;
export function getSingletons(): any;
export function clear(): void;
export function bind(binding: string, closure: any): void;
export function singleton(binding: string, closure: any): void;
export function use<A>(binding: string, ...args: any[]): A;
export function make(Obj: Function): any;
