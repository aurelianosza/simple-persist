export interface BaseDataManager {
    create(data: Object): Promise<Object>,
    read(filters: any[], limit: number): Promise<any[]>,
    update(filters: any[], data: any): Promise<any>,
    delete(filters: any[]): Promise<any[]>
}
