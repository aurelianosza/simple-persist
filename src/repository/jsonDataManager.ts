import fs from "fs";
import { CanEvaluateLines, CanEvaluateLinesInterface } from "../decorators/canEvaluateLines";
import { BaseDataManager, DataManagerLine } from "./baseDataManager";
import { generateRandomId } from "../tools/helpers";
import { get, set } from "lodash";
import path from "path";
import { Filter, updatedEntityDetails } from "./types";

@CanEvaluateLines
export class JsonDataManager<T extends Object> implements BaseDataManager<T>, CanEvaluateLinesInterface
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

            this.saveUsingSwap({});
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

    private saveUsingSwap(jsonContentToSave: any)
    {
        const originalFileName = this.getFullyEntityName();
        const swapFileName = this.getFullSwapEntityName();

        this.createSwapFolder(swapFileName);
        fs.writeFileSync(
            swapFileName,
            JSON.stringify(jsonContentToSave, null, 2),
            "utf-8"
        )

        fs.copyFileSync(swapFileName, originalFileName);
        fs.unlinkSync(swapFileName);
    }

    create(data: T): Promise<T>
    {
        const jsonFullContent = this.loadJsonFullContent();

        if (!get(data, this.keyBy, false)) {
            set(data, this.keyBy, this.generateRandomModelId());
        }
        set(jsonFullContent, get(data, this.keyBy), data);

        this.saveUsingSwap(jsonFullContent);

        return Promise.resolve(data);
    }

    read(filters: any[], limit: number = 50): Promise<any[]> {

        const jsonFullContent = this.loadJsonFullContent();

        return Promise.resolve(
            Object.values(jsonFullContent)
                .filter((line) => this.evaluateLine(filters, line))
                .slice(0, limit)
        );
    }

    update(filters: Filter[], data: DataManagerLine): Promise<any>
    {
        const jsonFullContent = this.loadJsonFullContent();

        const dataToReturn: updatedEntityDetails = {
            rowsAffected : 0
        }

        const updatedFullContent = Object.entries(jsonFullContent)
            .reduce((accumulator: any, [key, row]) => {

                if (this.evaluateLine(filters, row)) {
                    dataToReturn['rowsAffected']++;
                    
                    accumulator[key] = {
                        ...row,
                        ...data
                    }
                } else {
                    accumulator[key] = row;
                }

                return accumulator;
            }, {});

        this.saveUsingSwap(updatedFullContent);

        return Promise.resolve(dataToReturn);
    }

    delete(filters: Filter[]): Promise<any[]>
    {
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

        this.saveUsingSwap(registersToMaintain);

        return Promise.resolve(Object.values(deletedItems));
    }

    find(key: string|number): Promise<T|null>
    {
        const jsonFullContent = this.loadJsonFullContent();
        return Promise.resolve(get(jsonFullContent, key, null));
    }
}
