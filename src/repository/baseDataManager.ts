import { Filter } from "./types";

export type DataManagerLine = {
  [key: string]: any;
} | {}

export interface BaseDataManager {
    create(data: DataManagerLine): Promise<DataManagerLine>,
    read(filters: Filter[], limit: number): Promise<DataManagerLine[]>,
    update(filters: Filter[], data: any): Promise<DataManagerLine>,
    delete(filters: Filter[]): Promise<DataManagerLine[]>
}
