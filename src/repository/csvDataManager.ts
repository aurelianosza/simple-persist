import { BaseDataManager } from "./baseDataManager";
import * as csv from 'fast-csv';
import fs from "fs";
import { generateRandomId, orderObjectByHeaders, match } from "../tools/helpers";
import { get, head, reject } from "lodash";

type FilterOperation = "=" | ">" | "<" | ">=" | "<=" | "!=";


export class CsvDataManager implements BaseDataManager {

    path: string;
    entityName: string;
    headers: string[];
    delimiter: string = "|";

    constructor(path: string, entityName: string, headers: string[]) {
        this.path = path;
        this.entityName = entityName;
        this.headers = headers;
    }

    private getFullyEntityName(): string
    {
        return `${this.path}/${this.entityName}.csv`;
    }

    private getFullSwapEntityName(): string
    {
        return `${this.path}/swap/${this.entityName}.csv`
    }

    private getFileWriteStream(): fs.WriteStream
    {
        return fs.createWriteStream(this.getFullyEntityName(), {
            flags: "a"
        });
    }
    
    private getSwapReadStream(): fs.ReadStream
    {
        return fs.createReadStream(this.getFullSwapEntityName())
    }

    private getSwapWriteStream(): fs.WriteStream
    {
        return fs.createWriteStream(this.getFullSwapEntityName(), {
            flags: "a"
        });
    }

    private getFileReadStream(): fs.ReadStream
    {
        return fs.createReadStream(this.getFullyEntityName());
    }

    private getCsvWriteStream()
    {
        const csvWriteStream =  csv.format({
            headers: false,
            quote: true,
            delimiter: this.delimiter
        });
        
        csvWriteStream.pipe(this.getFileWriteStream())
            .on('close', () => {
                this.getFileWriteStream().write("\n")
            });

        return csvWriteStream;
    }

    private getCsvSwapWriteStream()
    {
        const csvWriteStream =  csv.format({
            headers: false,
            quote: true,
            delimiter: this.delimiter
        });
        
        csvWriteStream.pipe(this.getSwapWriteStream())
            .on('close', () => {
                this.getSwapWriteStream().write("\n")
            });

        return csvWriteStream;
    }

    private getCsvReadStream()
    {
        return csv.parse({
            headers: true,
            quote: "\"",
            delimiter: this.delimiter
        });
    }

    private generateRandomModelId(): string
    {
        return generateRandomId();
    }

    create(data: any): any {

        const csvWriteStream = this.getCsvWriteStream();

        if (!data['id']) {
            data['id'] = this.generateRandomModelId();
        }

        const ordered = orderObjectByHeaders(data, this.headers);

        csvWriteStream.write(ordered);
        csvWriteStream.end();

        return Promise.resolve(data);
    }

    private evaluateLine(filters: any[], line: any): boolean
    {
        if (filters.length == 0) {
            return true;
        }

        const operations: Record<FilterOperation, (a: any, b: any) => boolean> = {
            "=":  (a, b) => a == b,
            "!=": (a, b) => a != b,
            ">":  (a, b) => a > b,
            "<":  (a, b) => a < b,
            ">=": (a, b) => a >= b,
            "<=": (a, b) => a <= b
        };

        return filters.every((filter: {
            operation : FilterOperation,
            field: string,
            value: string|number
        }) => {

            const fieldValue = get(line, filter.field, null);
            return operations[filter.operation]?.(fieldValue, filter.value) ?? false;

        });
    }

    read(filters: {
        operation : FilterOperation,
        field: string,
        value: string|number
    }[], limit: number = 50): Promise<any[]>
    {
        return new Promise((resolve, reject) => {
            
            const rowsToReturn: any[] = [];

            const fileStream = this.getFileReadStream()
                .pipe(this.getCsvReadStream())
                .on("data", (row: any) => {

                    if (rowsToReturn.length >= limit) {
                        fileStream.destroy();
                        resolve(rowsToReturn);
                    }

                    if (this.evaluateLine(filters, row)) {
                        rowsToReturn.push(row);
                    }
                })
                .on("end", () => resolve(rowsToReturn))
                .on("error", (err: Error) => {
                    reject(err);
                });
        });
    }

    update(filters: any[], data: any): Promise<any> {
        const dataToReturn: any = {
            rowsAffected : 0
        }

        const mainFileStream = this.getFileReadStream()
            .pipe(this.getCsvReadStream());

        const swapFileWriteStream = this.getCsvSwapWriteStream();
        
        return new Promise((resolve, _reject) => {

            mainFileStream
                .on('headers', (headers: any) => {
                    swapFileWriteStream.write(headers);
                })
                .on("data", (row: any) => {
                    if (this.evaluateLine(filters, row)) {
                        const newRow = orderObjectByHeaders({
                            ...row,
                            ...data
                        }, this.headers);

                        dataToReturn['rowsAffected']++;
                        swapFileWriteStream.write(newRow);
                        return;
                    }

                    swapFileWriteStream.write(row);
                })
                .on("end", () => {
                    swapFileWriteStream.end();
                })
                .on("finish", () => {
                    fs.rmSync(this.getFullyEntityName());

                    fs.createReadStream(this.getFullSwapEntityName())
                        .pipe(this.getFileWriteStream())
                        .on("finish", () => {

                            fs.rmSync(this.getFullSwapEntityName())
                            resolve(dataToReturn);
                        });
                });
        });
    }

    delete(filters: {
        operation : FilterOperation,
        field: string,
        value: string|number
    }[]): Promise<any[]> {
        const rowsToReturn: any[] = [];

        const mainFileStream = this.getFileReadStream()
            .pipe(this.getCsvReadStream())

        const swapFileReadStream = fs.createWriteStream(this.getFullSwapEntityName());

        const swapFileCsvEntity = csv.format({
            headers: true,
        });
        
        swapFileCsvEntity.pipe(swapFileReadStream);

        return new Promise((resolve, _reject) => {

            mainFileStream
                .on('headers', (headers: any) => {
                    swapFileCsvEntity.write(headers);
                })
                .on("data", (row: any) => {
                    if (this.evaluateLine(filters, row)) {
                        rowsToReturn.push(row);
                        return;
                    }

                    swapFileCsvEntity.write(row);
                })
                .on("end", () => {
                    swapFileCsvEntity.end();
                })
                .on("finish", () => {

                    fs.rmSync(this.getFullyEntityName());

                    fs.createReadStream(this.getFullSwapEntityName())
                        .pipe(this.getFileWriteStream())
                        .on("finish", () => {

                            fs.rmSync(this.getFullSwapEntityName())
                            resolve(rowsToReturn);

                        });
                });
        });
    }
}
