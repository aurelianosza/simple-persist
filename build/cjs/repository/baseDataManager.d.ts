import { CsvDataManager } from "./csvDataManager";
import { JsonDataManager } from "./jsonDataManager";
import { Filter } from "./types";
export type DataManagerLine = {
    [key: string]: any;
} | {};
type DataManagerType = "csv" | "json";
export interface BaseDataManager<T> {
    create(data: T): Promise<T>;
    read(filters: Filter[], limit?: number): Promise<T[]>;
    update(filters: Filter[], data: any): Promise<T>;
    delete(filters: Filter[]): Promise<T[]>;
    find(key: string | number): Promise<T | null>;
}
export declare class DataManagerFactory {
    requestedType?: DataManagerType;
    requestedPath?: string;
    requestedEntityName?: string;
    requestedHeaders?: string[];
    repositories: {
        csv: typeof CsvDataManager;
        json: typeof JsonDataManager;
    };
    type(requestedType: DataManagerType): DataManagerFactory;
    path(requestedPath: string): DataManagerFactory;
    entityName(requestedEntityName: string): DataManagerFactory;
    headers(requestedHeaders: string[]): DataManagerFactory;
    create<T extends Object>(): BaseDataManager<T>;
}
export {};
