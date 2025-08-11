import { Filter } from "./types";

export type DataManagerLine = {
  [key: string]: any;
} | {}

export interface BaseDataManager<T> {
    create(data: T): Promise<T>,
    read(filters: Filter[], limit: number): Promise<T[]>,
    update(filters: Filter[], data: any): Promise<T>,
    delete(filters: Filter[]): Promise<T[]>
	find(key: string|number): Promise<T|null>
}
