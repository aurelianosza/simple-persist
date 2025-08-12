import { BaseDataManager } from "./baseDataManager";
import { Filter, FilterOperation } from "./types";
import { CanEvaluateLinesInterface } from "../decorators/canEvaluateLines";
export declare class CsvDataManager<T extends Object> implements BaseDataManager<T>, CanEvaluateLinesInterface {
    path: string;
    entityName: string;
    headers: string[];
    delimiter: string;
    keyBy: string;
    evaluateLine: (filters: any[], line: any) => boolean;
    constructor(path: string, entityName: string, headers: string[]);
    private getFullyEntityName;
    private getFullSwapEntityName;
    private getFileWriteStream;
    private getSwapWriteStream;
    private getFileReadStream;
    private getCsvWriteStream;
    private getCsvSwapWriteStream;
    private getCsvReadStream;
    create(data: T): any;
    read(filters: {
        operation: FilterOperation;
        field: string;
        value: string | number;
    }[], limit?: number): Promise<any[]>;
    update(filters: any[], data: any): Promise<any>;
    delete(filters: Filter[]): Promise<any[]>;
    find(key: string | number): Promise<T | null>;
}
