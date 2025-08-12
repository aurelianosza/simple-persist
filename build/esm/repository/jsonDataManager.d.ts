import { CanEvaluateLinesInterface } from "../decorators/canEvaluateLines";
import { BaseDataManager, DataManagerLine } from "./baseDataManager";
import { Filter } from "./types";
export declare class JsonDataManager<T extends Object> implements BaseDataManager<T>, CanEvaluateLinesInterface {
    path: string;
    entityName: string;
    fields: string[];
    keyBy: string;
    evaluateLine: (filters: any[], line: any) => boolean;
    constructor(path: string, entityName: string, fields: string[]);
    private getFullyEntityName;
    private getFullSwapEntityName;
    private loadJsonFullContent;
    private generateRandomModelId;
    private createSwapFolder;
    private saveUsingSwap;
    create(data: T): Promise<T>;
    read(filters: any[], limit?: number): Promise<any[]>;
    update(filters: Filter[], data: DataManagerLine): Promise<any>;
    delete(filters: Filter[]): Promise<any[]>;
    find(key: string | number): Promise<T | null>;
}
