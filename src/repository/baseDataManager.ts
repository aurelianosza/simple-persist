export type DataManagerLine = {
  [key: string]: any;
} | {}

export interface BaseDataManager {
    create(data: DataManagerLine): Promise<DataManagerLine>,
    read(filters: any[], limit: number): Promise<DataManagerLine[]>,
    update(filters: any[], data: any): Promise<DataManagerLine>,
    delete(filters: any[]): Promise<DataManagerLine[]>
}
