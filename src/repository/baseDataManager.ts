import { appendFile } from "fs";
import { CsvDataManager } from "./csvDataManager";
import { JsonDataManager } from "./jsonDataManager";
import { Filter } from "./types";

export type DataManagerLine = {
  [key: string]: any;
} | {}

type DataManagerType = "csv" | "json";

export interface BaseDataManager<T> {
    create(data: T): Promise<T>,
    read(filters: Filter[], limit?: number): Promise<T[]>,
    update(filters: Filter[], data: any): Promise<T>,
    delete(filters: Filter[]): Promise<T[]>
	find(key: string|number): Promise<T|null>
}

export class DataManagerFactory {

	requestedType?: DataManagerType;
	requestedPath?: string;
	requestedEntityName?: string;
	requestedHeaders?: string[];

	repositories = {
		"csv" : CsvDataManager,
		"json" : JsonDataManager
	}

	type(requestedType : DataManagerType): DataManagerFactory
	{
		this.requestedType = requestedType;
		return this;
	}

	path(requestedPath : string): DataManagerFactory
	{
		this.requestedPath = requestedPath;
		return this;
	}

	entityName(requestedEntityName : string): DataManagerFactory
	{
		this.requestedEntityName = requestedEntityName;
		return this;
	}

	headers(requestedHeaders: string[]): DataManagerFactory
	{
		this.requestedHeaders = requestedHeaders;
		return this;
	}

	create<T extends Object>(): BaseDataManager<T>
	{
		if (!this.requestedType || !(this.requestedType in this.repositories)) {
			throw new Error("Type of repository invalid or not defined.");
		}

		if (!this.requestedPath) {
			throw new Error("Path of repository dont defined.");
		}

		if (!this.requestedEntityName) {
			throw new Error("Entity name dont defined.");
		}

		return Reflect.construct(
			this.repositories[this.requestedType],
			[
				this.requestedPath,
				this.requestedEntityName,
				this.requestedHeaders
			]
		);
	}
}
