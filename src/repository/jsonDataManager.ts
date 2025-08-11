import fs from "fs";
import { CanEvaluateLines, CanEvaluateLinesInterface } from "../decorators/canEvaluateLines";
import { BaseDataManager, DataManagerLine } from "./baseDataManager";
import { generateRandomId } from "../tools/helpers";
import { get, set } from "lodash";
import path from "path";
import { Filter } from "./types";

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

    private getFullSwapEntityName(): string
    {
        return `${this.path}/swap/${this.entityName}.json`
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

    private generateRandomModelId(): string
    {
        return generateRandomId();
    }

    private createSwapFolder(filePath: string)
    {
        const directory = path.dirname(filePath);
        fs.mkdirSync(directory, { recursive: true });
    }

    create(data: DataManagerLine): Promise<Object>
    {
        const originalFileName = this.getFullyEntityName();
        const swapFileName = this.getFullSwapEntityName();
        const jsonFullContent = this.loadJsonFullContent();

        if (!get(data, this.keyBy, false)) {
            set(data, this.keyBy, this.generateRandomModelId());
        }
        set(jsonFullContent, get(data, 'id'), data);

        this.createSwapFolder(swapFileName);

        fs.writeFileSync(
            swapFileName,
            JSON.stringify(jsonFullContent, null, 2),
            "utf-8"
        );

        fs.copyFileSync(swapFileName, originalFileName);
        fs.unlinkSync(swapFileName);

        return Promise.resolve(data);
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

    delete(filters: Filter[]): Promise<any[]>
    {
        const originalFileName = this.getFullyEntityName();
        const swapFileName = this.getFullSwapEntityName();
        const jsonFullContent = this.loadJsonFullContent();

        const [registersToMaintain, deletedItems] = Object.entries(jsonFullContent)
            .reduce(([maintain, deleted], [key, row]) => {
                
                if (!this.evaluateLine(filters, row)) {
                    set(maintain, key, row);
                } else {
                    set(deleted, key, row);
                }

                return [
                    maintain, deleted
                ];

            }, [{}, {}]);

        this.createSwapFolder(swapFileName);
        fs.writeFileSync(
            swapFileName,
            JSON.stringify(registersToMaintain, null, 2),
            "utf-8"
        )

        fs.copyFileSync(swapFileName, originalFileName);
        fs.unlinkSync(swapFileName);

        return Promise.resolve(Object.values(deletedItems));
    }
}
