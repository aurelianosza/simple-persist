import { get } from "lodash";
import { FilterOperation } from "../repository/types";

export function CanEvaluateLines(constructor: any) {
    constructor.prototype.evaluateLine = (filters: any[], line: any): boolean => {
         if (filters.length == 0) {
            return true;
        }

        const operations: Record<FilterOperation, (a: any, b: any) => boolean> = {
            "=":  (a, b) => a == b,
            "!=": (a, b) => a != b,
            ">":  (a, b) => a > b,
            "<":  (a, b) => a < b,
            ">=": (a, b) => a >= b,
            "<=": (a, b) => a <= b
        };

        return filters.every((filter: {
            operation : FilterOperation,
            field: string,
            value: string|number
        }) => {

            const fieldValue = get(line, filter.field, null);
            return operations[filter.operation]?.(fieldValue, filter.value) ?? false;

        });
    }
}

export interface CanEvaluateLinesInterface {
    evaluateLine(filters: any[], line: any): boolean
}
