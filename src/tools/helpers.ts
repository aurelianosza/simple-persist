export function generateRandomId(length: number = 16): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    return Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
}

export function orderObjectByHeaders(obj: Record<string, any>, headers: string[]) {
    const ordered: Record<string, any> = {};
    for (const key of headers) {
        ordered[key] = obj[key] ?? "";
    }
    return ordered;
}

export function match<T, R>(value: T, patterns: Record<string | number, R>, defaultValue: R): R {
    return patterns[value as keyof typeof patterns] ?? defaultValue;
}
