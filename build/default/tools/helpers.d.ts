export declare function generateRandomId(length?: number): string;
export declare function orderObjectByHeaders(obj: Record<string, any>, headers: string[]): Record<string, any>;
export declare function match<T, R>(value: T, patterns: Record<string | number, R>, defaultValue: R): R;
