"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomId = generateRandomId;
exports.orderObjectByHeaders = orderObjectByHeaders;
exports.match = match;
function generateRandomId(length = 16) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
}
function orderObjectByHeaders(obj, headers) {
    var _a;
    const ordered = {};
    for (const key of headers) {
        ordered[key] = (_a = obj[key]) !== null && _a !== void 0 ? _a : "";
    }
    return ordered;
}
function match(value, patterns, defaultValue) {
    var _a;
    return (_a = patterns[value]) !== null && _a !== void 0 ? _a : defaultValue;
}
