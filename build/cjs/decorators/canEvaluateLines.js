"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanEvaluateLines = CanEvaluateLines;
const lodash_1 = require("lodash");
function CanEvaluateLines(constructor) {
    constructor.prototype.evaluateLine = (filters, line) => {
        if (filters.length == 0) {
            return true;
        }
        const operations = {
            "=": (a, b) => a == b,
            "!=": (a, b) => a != b,
            ">": (a, b) => a > b,
            "<": (a, b) => a < b,
            ">=": (a, b) => a >= b,
            "<=": (a, b) => a <= b
        };
        return filters.every((filter) => {
            var _a, _b;
            const fieldValue = (0, lodash_1.get)(line, filter.field, null);
            return (_b = (_a = operations[filter.operation]) === null || _a === void 0 ? void 0 : _a.call(operations, fieldValue, filter.value)) !== null && _b !== void 0 ? _b : false;
        });
    };
}
