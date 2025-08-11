import fs from "fs";
import { CanEvaluateLines, CanEvaluateLinesInterface } from "../decorators/canEvaluateLines";
import { BaseDataManager, DataManagerLine } from "./baseDataManager";

@CanEvaluateLines
export class JsonDataManager implements BaseDataManager, CanEvaluateLinesInterface
{
    path: string;
    entityName: string;
    fields: string[];

    keyBy: string = "id";

    evaluateLine!: (filters: any[], line: any) => boolean;

    constructor(path: string, entityName: string, fields: string[])
    {
        this.path = path;
        this.entityName = entityName;
        this.fields = fields;
    }
 
    private getFullyEntityName(): string
    {
        return `${this.path}/${this.entityName}.json`;
    }

    private loadJsonFullContent(): DataManagerLine
    {
        const fullEntityFileName = this.getFullyEntityName();

        if (!fs.existsSync(fullEntityFileName)) {
            console.warn(`Entity ${this.entityName} doesn\`t exists`);
            return {};
        }

        return JSON.parse(fs.readFileSync(fullEntityFileName, "utf-8"));
    }  

    create(data: Object): Promise<Object> {
        throw new Error("Method not implemented.");
    }

    read(filters: any[], limit: number): Promise<any[]> {

        const jsonFullContent = this.loadJsonFullContent();

        return Promise.resolve(
            Object.values(jsonFullContent)
                .filter((line) => this.evaluateLine(filters, line))
                .slice(0, limit)
        );
    }

    update(filters: any[], data: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    delete(filters: any[]): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
}
